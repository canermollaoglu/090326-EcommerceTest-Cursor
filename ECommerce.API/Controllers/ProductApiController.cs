// These using directives import the namespaces needed by this controller:
// - ECommerce.Core.Entities: gives access to the Product entity class.
// - ECommerce.Core.Interfaces: gives access to IService<Product>.
// - Microsoft.AspNetCore.Mvc: provides API controller attributes and result types.
using AutoMapper;
using ECommerce.Core.DTOs;
using ECommerce.Core.Entities;
using ECommerce.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

// This namespace keeps the controller inside the API layer of the solution.
namespace ECommerce.API.Controllers
{
    // [ApiController] enables API-specific behavior:
    // - automatic model validation responses
    // - parameter binding inference from route/body/query
    [ApiController]
    // This sets the base route to: /api/ProductApi
    // because [controller] becomes the controller class name without "Controller".
    [Route("api/[controller]")]
    public class ProductApiController : ControllerBase
    {
        // This field stores the business service so controller actions
        // can delegate product operations to the business layer.
        private readonly IService<Product> _productService;
        private readonly IMapper _mapper;

        // Constructor injection:
        // ASP.NET Core DI will provide the registered IService<Product> implementation
        // (currently ProductService from Program.cs).
        public ProductApiController(IService<Product> productService, IMapper mapper)
        {
            _productService = productService;
            _mapper = mapper;
        }

        // GET: /api/ProductApi
        // Returns all products.
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductResponseDto>>> GetAll()
        {
            //buradaki map mantığını açıkla:
            // GetAllAsync() metodu, Product türünde bir koleksiyon döndürür.
            // Ancak, API istemcilerine genellikle Entity'lerin tamamını değil, sadece ihtiyaç duyulan verileri içeren DTO'lar (Data Transfer Objects) sunmak daha iyidir.
            // Bu nedenle, AutoMapper kullanarak Product koleksiyonunu ProductResponseDto koleksiyonuna dönüştürüyoruz.
            // AutoMapper, Product nesnelerindeki verileri alır ve ProductResponseDto nesnelerine kopyalar. Bu sayede, API istemcilerine sadece gerekli alanları içeren daha hafif bir veri yapısı sunmuş oluruz.

            // Call the service layer to fetch all products.
            var products = await _productService.GetAllAsync();

            // Return HTTP 200 with the list in the response body.
            var productDTO = _mapper.Map<IEnumerable<ProductResponseDto>>(products);
            return Ok(productDTO);
        }

        // GET: /api/ProductApi/{id}
        // Returns one product by its Guid id.
        [HttpGet("{id:guid}")]
        public async Task<ActionResult<ProductResponseDto>> GetById(Guid id)
        {
            // Ask the service for the product.
            var product = await _productService.GetByIdAsync(id);

            // If no product exists for this id, return HTTP 404.
            if (product is null)
                return NotFound($"Product with id '{id}' was not found.");

            var productDTO = _mapper.Map<ProductResponseDto>(product);
            // Otherwise return HTTP 200 with the product.
            return Ok(productDTO);
        }

        // POST: /api/ProductApi
        // Creates a new product.
        [HttpPost]
        public async Task<ActionResult> Create([FromBody] ProductCreateDto dto)
        {
            if (dto is null)
                return BadRequest("Product payload is required.");

            //dto'yu product'a maplerken id'yi neden manuel olarak atıyoruz?
            // ProductCreateDto, ürün oluşturmak için gerekli olan bilgileri içerir ancak Id alanı genellikle istemciden gelmez çünkü bu Id, veritabanında yeni bir kayıt oluşturulurken otomatik olarak oluşturulur (örneğin, Guid.NewGuid() ile). Bu nedenle, AutoMapper, ProductCreateDto'dan Product'a maplerken Id alanını doldurmaz.
            // Bu yüzden, mapleme işleminden sonra manuel olarak product.Id'ye yeni bir Guid atıyoruz. Bu, yeni oluşturulan ürünün benzersiz bir kimliğe sahip olmasını sağlar ve veritabanında kaydedilirken bu Id kullanılabilir.
            var product = _mapper.Map<Product>(dto);
            product.Id = Guid.NewGuid();

            try
            {
                await _productService.AddAsync(product);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

            //burada sayfaya tekrar productresponse dto'sunu döndürüyoruz çünkü client'ın yeni oluşturulan ürünün detaylarını görmesi iyi olur. Ayrıca, CreatedAtAction kullanarak HTTP 201 döndürüyoruz ve Location başlığına GET by id endpoint'ini ekliyoruz. Böylece, client yeni oluşturulan ürüne kolayca erişebilir.
            return CreatedAtAction(nameof(GetById), new { id = product.Id }, _mapper.Map<ProductResponseDto>(product));

            // Return HTTP 201 and include a Location header pointing to GET by id.
            //Türkçe olarak açıkla:
            // HTTP 201 Created, yeni bir kaynak oluşturulduğunu belirtir.
            // CreatedAtAction, Location başlığına GET by id endpoint'ini ekler.
            //Yani, client POST ile yeni bir ürün oluşturduğunda, API 201 döner ve Location başlığında bu yeni ürünün GET by id endpoint'ini verir.
            //Örnek ver:
            // Client POST /api/ProductApi
            // Body: { "productName": "New Product", "price": 10.99, "stockQuantity": 100 }
            // Response: 201 Created
            // Headers: Location: /api/ProductApi/{newlyCreatedProductId}
            //Bunu yapmasak olmaz mı?
            // Evet, yapmasak da olurdu ama RESTful API tasarımında bu iyi bir uygulamadır çünkü client'ların yeni oluşturulan kaynağa kolayca erişmesini sağlar. Ayrıca, API'nin kaynakları nasıl organize edildiği konusunda net bir iletişim sağlar.
        }

        // PUT: /api/ProductApi/{id}
        // Updates an existing product.
        [HttpPut("{id:guid}")]
        public async Task<ActionResult> Update(Guid id, [FromBody] ProductUpdateDto dto)
        {
            if (dto is null)
                return BadRequest("Product payload is required.");

            if (id != dto.Id)
                return BadRequest("Route id and product id must match.");

            var product = _mapper.Map<Product>(dto);

            try
            {
                await _productService.UpdateAsync(product);
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("bulunamadı", StringComparison.OrdinalIgnoreCase))
                    return NotFound(ex.Message);
                return BadRequest(ex.Message);
            }
            // Return HTTP 204 No Content when update succeeds.
            return NoContent();
        }

        // DELETE: /api/ProductApi/{id}
        // Deletes a product by id.
        [HttpDelete("{id:guid}")]
        public async Task<ActionResult> Delete(Guid id)
        {
            try
            {
                // Service handles existence check and deletion.
                await _productService.RemoveAsync(id);
            }
            catch (Exception ex)
            {
                // Map missing product case to 404; otherwise return 400.
                if (ex.Message.Contains("not found", StringComparison.OrdinalIgnoreCase) ||
                    ex.Message.Contains("bulunamadı", StringComparison.OrdinalIgnoreCase))
                {
                    return NotFound(ex.Message);
                }

                return BadRequest(ex.Message);
            }

            // Return HTTP 204 when delete succeeds.
            return NoContent();
        }
    }
}

using ECommerce.Core.DTOs;
using ECommerce.Core.Entities;
using ECommerce.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoryApiController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public CategoryApiController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        /// <summary>
        /// Tüm kategorileri listeler. Ürün eklerken geçerli CategoryId almak için kullanın.
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoryResponseDto>>> GetAll()
        {
            var categories = await _unitOfWork.Categories.GetAllAsync();
            var dtos = categories.Select(c => new CategoryResponseDto
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description,
                CreatedDate = c.CreatedDate
            });
            return Ok(dtos);
        }

        /// <summary>
        /// Yeni kategori ekler. Dönen Id değerini ürün eklerken CategoryId olarak kullanın.
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<CategoryResponseDto>> Create([FromBody] CategoryCreateDto dto)
        {
            if (dto is null)
                return BadRequest("Kategori verisi gerekli.");

            var category = new Category
            {
                Id = Guid.NewGuid(),
                Name = dto.Name,
                Description = dto.Description,
                CreatedDate = DateTime.UtcNow
            };

            await _unitOfWork.Categories.AddAsync(category);
            await _unitOfWork.SaveChangesAsync();

            var response = new CategoryResponseDto
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description,
                CreatedDate = category.CreatedDate
            };
            return CreatedAtAction(nameof(GetAll), new { }, response);
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<CategoryResponseDto>> GetById(Guid id)
        {
            var category = await _unitOfWork.Categories.GetByIdAsync(id);
            if (category is null)
                return NotFound($"Kategori bulunamadı: {id}");
            return Ok(new CategoryResponseDto
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description,
                CreatedDate = category.CreatedDate
            });
        }

        [HttpPut("{id:guid}")]
        public async Task<ActionResult> Update(Guid id, [FromBody] CategoryUpdateDto dto)
        {
            if (dto is null)
                return BadRequest("Kategori verisi gerekli.");
            if (id != dto.Id)
                return BadRequest("Route id ile body Id eşleşmiyor.");
            var category = await _unitOfWork.Categories.GetByIdAsync(id);
            if (category is null)
                return NotFound("Kategori bulunamadı.");
            category.Name = dto.Name;
            category.Description = dto.Description;
            category.ModifiedDate = DateTime.UtcNow;
            await _unitOfWork.Categories.UpdateAsync(category);
            await _unitOfWork.SaveChangesAsync();
            return NoContent();
        }
    }
}

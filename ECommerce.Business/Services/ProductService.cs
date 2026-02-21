using System.Linq.Expressions;
using ECommerce.Core.Entities;
using ECommerce.Core.Interfaces;
using ECommerce.DataAccess.Context;
using ECommerce.DataAccess.Repositories;

namespace ECommerce.Business.Services
{
    public class ProductService : IService<Product>
    {
        private readonly ProductRepository _repository;
        public ProductService(ProductRepository pRepo)
        {
            _repository = pRepo;
        }
        public async Task AddAsync(Product product)
        {
            // ✅ İş kuralı SERVİS'TE
            if (product.Price <= 0)
                throw new Exception("Ürün fiyatı 0 veya negatif olamaz");

            if (product.StockQuantity < 0)
                throw new Exception("Stok negatif olamaz");

            await _repository.AddAsync(product);
            await _repository.SaveChangesAsync();
        }

        public Task<IEnumerable<Product>> FindAsync(Expression<Func<Product, bool>> predicate)
        {
            return _repository.FindAsync(predicate);
        }

        public async Task<IEnumerable<Product>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<Product?> GetByIdAsync(Guid id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task RemoveAsync(Guid id)
        {
            var product = await _repository.GetByIdAsync(id);

            if (product == null)
                throw new Exception("Ürün bulunamadı.");

            await _repository.RemoveAsync(product);
            await _repository.SaveChangesAsync();
        }

        public async Task UpdateAsync(Product product)
        {
            var existingProduct = await _repository.GetByIdAsync(product.Id);

            if (existingProduct == null)
                throw new Exception("Ürün bulunamadı");

            existingProduct.ProductName = product.ProductName;
            existingProduct.Price = product.Price;
            existingProduct.StockQuantity = product.StockQuantity;

            await _repository.UpdateAsync(existingProduct);
            await _repository.SaveChangesAsync();
        }
    }
}
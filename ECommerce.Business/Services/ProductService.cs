using System.Linq.Expressions;
using ECommerce.Core.Entities;
using ECommerce.Core.Interfaces;
using ECommerce.DataAccess.Context;
using ECommerce.DataAccess.Repositories;

namespace ECommerce.Business.Services
{
    public class ProductService : IService<Product>
    {
        private readonly IUnitOfWork _unitOfWork;
        public ProductService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task AddAsync(Product product)
        {
            // ✅ İş kuralı SERVİS'TE
            if (product.Price <= 0)
                throw new Exception("Ürün fiyatı 0 veya negatif olamaz");

            if (product.StockQuantity < 0)
                throw new Exception("Stok negatif olamaz");

            await _unitOfWork.Products.AddAsync(product);
            await _unitOfWork.SaveChangesAsync();
        }

        public Task<IEnumerable<Product>> FindAsync(Expression<Func<Product, bool>> predicate)
        {
            return _unitOfWork.Products.FindAsync(predicate);
        }

        public async Task<IEnumerable<Product>> GetAllAsync()
        {
            return await _unitOfWork.Products.GetAllAsync();
        }

        public async Task<Product?> GetByIdAsync(Guid id)
        {
            return await _unitOfWork.Products.GetByIdAsync(id);
        }

        public async Task RemoveAsync(Guid id)
        {
            var product = await _unitOfWork.Products.GetByIdAsync(id);

            if (product == null)
                throw new Exception("Ürün bulunamadı.");

            await _unitOfWork.Products.RemoveAsync(product);
            await _unitOfWork.Products.SaveChangesAsync();
        }

        public async Task UpdateAsync(Product product)
        {
            var existingProduct = await _unitOfWork.Products.GetByIdAsync(product.Id);

            if (existingProduct == null)
                throw new Exception("Ürün bulunamadı");

            existingProduct.ProductName = product.ProductName;
            existingProduct.Price = product.Price;
            existingProduct.StockQuantity = product.StockQuantity;

            await _unitOfWork.Products.UpdateAsync(existingProduct);
            await _unitOfWork.Products.SaveChangesAsync();
        }
    }
}
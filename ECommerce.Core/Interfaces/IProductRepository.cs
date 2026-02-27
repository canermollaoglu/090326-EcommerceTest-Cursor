using ECommerce.Core.Entities;

namespace ECommerce.Core.Interfaces
{

    public interface IProductRepository : IGenericRepository<Product>
    {
        public Task<IEnumerable<Product>> GetByCategoryIdAsync(Guid categoryId);
        public Task<IEnumerable<Product>> GetProductsWithCategory();
        public Task<IEnumerable<Product>> GetByPriceRange(decimal minPrice, decimal maxPrice);
    }
}

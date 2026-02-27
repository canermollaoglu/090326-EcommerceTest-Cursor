namespace ECommerce.DataAccess.Repositories
{
    using System;
    using System.Collections.Generic;
    using System.Linq.Expressions;
    using System.Threading.Tasks;
    using ECommerce.Core.Entities;
    using ECommerce.Core.Interfaces;
    using ECommerce.DataAccess.Context;
    using Microsoft.EntityFrameworkCore;

    public class ProductRepository : GenericRepository<Product>
    {
        private readonly AppDbContext _context;
        public ProductRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        // Ürünlere özel ek veri erişim yöntemleri buraya eklenebilir

        public async Task<IEnumerable<Product>> GetByCategoryIdAsync(Guid categoryId)
        {
            return await _context.Products
            .Where(p => p.CategoryId == categoryId)

            .ToListAsync();
        }

        public async Task<IEnumerable<Product>> GetProductsWithCategory()
        {
            return await _context.Products
            .Include(p => p.Category)
            .ToListAsync();
        }

        public async Task<IEnumerable<Product>> GetByPriceRange(decimal minPrice, decimal maxPrice)
        {
            return await _context.Products
            .Where(p => p.Price >= minPrice && p.Price <= maxPrice)
            .ToListAsync();
        }
    }
}
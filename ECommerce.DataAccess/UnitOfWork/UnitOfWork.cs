using ECommerce.Core.Entities;
using ECommerce.Core.Interfaces;
using ECommerce.DataAccess.Context;
using ECommerce.DataAccess.Repositories;

namespace ECommerce.DataAccess
{
    /*
    Task = Asenkron işlem demektir.

    Yani
    Bu metod bekleme gerektirir (veritabanı işlemi gibi)

    <int>

    Bu metodun döndüreceği veri tipi.
    SaveChangesAsync() gerçekte şunu döner:kaç satır etkilendi bilgisi.
    */
    public class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext _context;
        public UnitOfWork(AppDbContext context)
        {
            _context = context;
            Products = new ProductRepository(_context);
            Categories = new CategoryRepository(_context);
        }
        public IProductRepository Products { get; }
        public IGenericRepository<Category> Categories { get; }
        public void Dispose()
        {
            _context.Dispose();
        }

        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }
    }
}
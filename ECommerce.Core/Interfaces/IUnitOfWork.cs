using ECommerce.Core.Entities;

namespace ECommerce.Core.Interfaces
{
    //Neden IDispossible dan türettik:
    /*
    Bu şu anlama gelir:
    Bu sınıf içinde dispose edilmesi gereken bir kaynak var. (DBContext)

    Senin durumda o kaynak:
    */
    /*
    Eğer IDisposable Olmazsa?
    Connection açık kalabilir
    Memory leak olabilir
    */

    public interface IUnitOfWork : IDisposable
    {
        IProductRepository Products { get; }
        IGenericRepository<Category> Categories { get; }
        Task<int> SaveChangesAsync();
    }
}
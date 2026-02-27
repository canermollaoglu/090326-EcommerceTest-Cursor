using ECommerce.Core.Entities;
using ECommerce.DataAccess.Context;

namespace ECommerce.DataAccess.Repositories
{

    public class CategoryRepository : GenericRepository<Category>
    {
        public CategoryRepository(AppDbContext context) : base(context)
        {

        }
    }
}
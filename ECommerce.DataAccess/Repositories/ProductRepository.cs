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
        public ProductRepository(AppDbContext context) : base(context)
        {

        }

        // Ürünlere özel ek veri erişim yöntemleri buraya eklenebilir
    }
}
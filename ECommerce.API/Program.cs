using ECommerce.Business.Services;
using ECommerce.Core.Entities;
using ECommerce.Core.Interfaces;
using ECommerce.DataAccess.Context;
using ECommerce.DataAccess.Repositories;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// appsettings.json dosyasından "DefaultConnection" ismindeki adresi okuyoruz.
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// DbContext'i servislere ekliyoruz.
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString));

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 1. Generic Repository
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));

// 2. Product için Özel Servis
//Programın herhangi bir yerinde IProductService veya IService<Product> talep edildiğinde, ProductService sınıfının bir örneği sağlanır. Dolayısı ile new ProductService() ifadesi yerine, bağımlılık enjeksiyonu konteyneri tarafından yönetilen bir örnek sağlanır. Bu, uygulamanın daha esnek ve test edilebilir olmasını sağlar.
builder.Services.AddScoped<IService<Product>, ProductService>();
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();

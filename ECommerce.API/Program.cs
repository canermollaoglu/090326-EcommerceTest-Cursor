using ECommerce.Business.Mapping;
using ECommerce.Business.Services;
using ECommerce.Core.Entities;
using ECommerce.Core.Interfaces;
using ECommerce.DataAccess;
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

// CORS: React frontend (Vite default port 5173) API'ye istek atabilsin
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://127.0.0.1:5173")
             .AllowAnyHeader()
             .AllowAnyMethod();
    });
});

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddAutoMapper(cfg =>
{
    cfg.AddProfile<ProductMappingProfile>();
});

/*
“Uygulama içinde biri IUnitOfWork isterse, ona UnitOfWork ver.”
Yani:
IUnitOfWork → Interface
UnitOfWork → Gerçek sınıf (Concrete class)

Bu Dependency Injection (DI) kaydıdır.
*/
//UnitOfWork
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

// ProductService
builder.Services.AddScoped<IService<Product>, ProductService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors();

app.UseAuthorization();

app.MapControllers();

app.Run();

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
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

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

app.UseAuthorization();

app.MapControllers();

app.Run();

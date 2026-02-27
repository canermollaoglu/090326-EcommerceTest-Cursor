# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Build
dotnet build

# Run API (HTTP: localhost:5185, HTTPS: localhost:7180)
dotnet run --project ECommerce.API

# EF Core migrations (target ECommerce.DataAccess, startup ECommerce.API)
dotnet ef migrations add <MigrationName> --project ECommerce.DataAccess --startup-project ECommerce.API
dotnet ef database update --project ECommerce.DataAccess --startup-project ECommerce.API
dotnet ef migrations remove --project ECommerce.DataAccess --startup-project ECommerce.API
```

No test project exists yet.

## Architecture

4-layer clean architecture (.NET 9, EF Core 9, SQL Server LocalDB):

```
ECommerce.API          → Controllers, DI setup, Swagger
ECommerce.Business     → Services with business rule validation
ECommerce.DataAccess   → EF Core context, repositories, UnitOfWork, migrations
ECommerce.Core         → Entities and interfaces (no external dependencies)
```

**Dependency direction**: API → Business → DataAccess → Core (Core has no outward dependencies)

## Key Patterns

**Generic Repository + Unit of Work**: `IGenericRepository<T>` provides CRUD/query operations. `IUnitOfWork` exposes typed repositories (`Products`, `Categories`) and a single `SaveChangesAsync()`. Services go through `IUnitOfWork`, never directly through repositories.

**Generic Service**: `IService<T>` is the business layer contract. Concrete services (e.g., `ProductService`) implement validation before delegating to `IUnitOfWork`.

**DI Registration** (in `Program.cs`):
- `AddScoped<IUnitOfWork, UnitOfWork>()`
- `AddScoped<IService<Product>, ProductService>()`
- Add new services/repos here following the same scoped pattern.

## Adding New Features

1. **Entity**: Add to `ECommerce.Core/Entities/`, inherit `BaseEntity` (provides `Guid Id`, `CreatedDate`, `ModifiedDate`)
2. **Interface**: Add repository interface in `ECommerce.Core/Interfaces/` extending `IGenericRepository<T>` if specialized queries are needed
3. **Repository**: Implement in `ECommerce.DataAccess/Repositories/` extending `GenericRepository<T>`
4. **DbSet**: Register in `AppDbContext`
5. **UnitOfWork**: Expose repository via `IUnitOfWork` and `UnitOfWork`
6. **Service**: Implement `IService<T>` in `ECommerce.Business/Services/`
7. **DI**: Register in `Program.cs`
8. **Migration**: Run `dotnet ef migrations add` command above

## Database

Connection string in `appsettings.json` targets `ECommerceDbTest` on `(localdb)\MSSQLLocalDB`. Cascade delete is configured on `Products.CategoryId → Categories.Id`.

## Known Issue

The initial migration defines `Id` columns as `int`, but all entities use `Guid` for `Id`. This mismatch may cause runtime errors if migrations are applied against a fresh database. Verify migration files match entity definitions when adding new migrations.

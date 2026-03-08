namespace ECommerce.Core.DTOs
{
    public class ProductUpdateDto
    {
        public Guid Id { get; set; }
        public string? ProductName { get; set; }
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public int StockQuantity { get; set; }

        public Guid CategoryId { get; set; }
    }
}
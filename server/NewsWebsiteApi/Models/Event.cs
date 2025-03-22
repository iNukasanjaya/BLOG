namespace NewsWebsiteApi.Models;

using MongoDB.Bson;

public class Event
{
    public string Id { get; set; } = ObjectId.GenerateNewId().ToString();
    public string Title { get; set; } = string.Empty;
    public decimal Price { get; set; } // Added Price
    public string Description { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public string Time { get; set; } = string.Empty; // Added Time
    public string Location { get; set; } = string.Empty; // Changed from Location to Venue
    public string Category { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string Status { get; set; } = "Draft";
    public string CreatedBy { get; set; } = string.Empty;
}
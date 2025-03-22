namespace NewsWebsiteApi.Models;

using MongoDB.Bson;

public class User
{
    public string Id { get; set; } = ObjectId.GenerateNewId().ToString();
    public string Username { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty; // Store hashed passwords
    public string Role { get; set; } = string.Empty; // e.g., "Admin" or "User"
}
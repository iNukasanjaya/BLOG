namespace NewsWebsiteApi.Services;

using MongoDB.Driver;
using NewsWebsiteApi.Models;
using System.Threading.Tasks;
using BCrypt.Net; // Add BCrypt for password hashing

public interface IUserService
{
    Task<User> GetByUsernameAsync(string username);
    Task CreateAsync(User user);
    bool VerifyPassword(string password, string passwordHash);
}

public class UserService : IUserService
{
    private readonly IMongoCollection<User> _users;

    public UserService(IMongoDatabase database)
    {
        _users = database.GetCollection<User>("users");
    }

    public async Task<User> GetByUsernameAsync(string username)
    {
        return await _users.Find(u => u.Username == username).FirstOrDefaultAsync();
    }

    public async Task CreateAsync(User user)
    {
        // Hash the password before saving
        user.PasswordHash = BCrypt.HashPassword(user.PasswordHash);
        await _users.InsertOneAsync(user);
    }

    // Helper method to verify password
    public bool VerifyPassword(string password, string passwordHash)
    {
        return BCrypt.Verify(password, passwordHash);
    }
}
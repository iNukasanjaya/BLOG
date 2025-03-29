using NewsWebsiteApi.Models;

namespace NewsWebsiteApi.Services
{
    public interface IAdvertisementService
    {
        Task CreateAsync(Advertisement advertisement);
        Task<List<Advertisement>> GetAllAsync();
        Task<Advertisement?> GetByIdAsync(string id);
        Task UpdateAsync(string id, Advertisement ad);
        Task DeleteAsync(string id);
    }
}
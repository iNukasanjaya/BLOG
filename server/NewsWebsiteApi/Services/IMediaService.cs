using NewsWebsiteApi.Models;

namespace NewsWebsiteApi.Services
{
    public interface IMediaService
    {
        Task CreateAsync(Media advertisement);
        Task<List<Media>> GetAllAsync();
        Task<Media?> GetByIdAsync(string id);
        Task UpdateAsync(string id, Media ad);
        Task DeleteAsync(string id);
    }
}

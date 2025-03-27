namespace NewsWebsiteApi.Services;

using Microsoft.AspNetCore.Http;
using NewsWebsiteApi.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface IEventService
{
    Task<List<Event>> GetAllAsync();
    Task<Event> GetByIdAsync(string id);
    Task<Event> CreateAsync(Event newEvent, IFormFile image);
    Task<Event> UpdateAsync(string id, Event updatedEvent, IFormFile? image);
    Task DeleteAsync(string id);
}
namespace NewsWebsiteApi.Services;

using MongoDB.Driver;
using NewsWebsiteApi.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface IEventService
{
    Task<List<Event>> GetAllAsync();
    Task<Event> GetByIdAsync(string id);
    Task<Event> CreateAsync(Event newEvent);
    Task UpdateAsync(string id, Event updatedEvent);
    Task DeleteAsync(string id);
}

public class EventService : IEventService
{
    private readonly IMongoCollection<Event> _events;

    public EventService(IMongoDatabase database)
    {
        _events = database.GetCollection<Event>("Events");
    }

    public async Task<List<Event>> GetAllAsync() =>
        await _events.Find(_ => true).ToListAsync();

    public async Task<Event> GetByIdAsync(string id) =>
        await _events.Find(e => e.Id == id).FirstOrDefaultAsync();

    public async Task<Event> CreateAsync(Event newEvent)
    {
        await _events.InsertOneAsync(newEvent);
        return newEvent;
    }

    public async Task UpdateAsync(string id, Event updatedEvent)
    {
        updatedEvent.Id = id;
        await _events.ReplaceOneAsync(e => e.Id == id, updatedEvent);
    }

    public async Task DeleteAsync(string id) =>
        await _events.DeleteOneAsync(e => e.Id == id);
}
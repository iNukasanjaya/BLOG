namespace NewsWebsiteApi.Controllers;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NewsWebsiteApi.Models;
using NewsWebsiteApi.Services;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class EventsController : ControllerBase
{
    private readonly IEventService _eventService;

    public EventsController(IEventService eventService)
    {
        _eventService = eventService;
    }

    [HttpGet]
    public async Task<ActionResult<List<Event>>> GetAll()
    {
        var events = await _eventService.GetAllAsync();
        return Ok(events);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Event>> GetById(string id)
    {
        var eventItem = await _eventService.GetByIdAsync(id);
        if (eventItem == null) return NotFound("Event not found.");
        return Ok(eventItem);
    }

    [HttpPost]
    [Authorize(Roles = "EventAdmin")]
    public async Task<ActionResult<Event>> Create([FromForm] Event newEvent, IFormFile image)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            newEvent.CreatedBy = User.Identity.Name ?? "Anonymous"; // Set the creator
            var createdEvent = await _eventService.CreateAsync(newEvent, image);
            return CreatedAtAction(nameof(GetById), new { id = createdEvent.Id }, createdEvent);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "EventAdmin")]
    public async Task<ActionResult<Event>> Update(string id, [FromForm] Event updatedEvent, IFormFile? image)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            updatedEvent.Id = id; // Ensure the ID is set
            updatedEvent.CreatedBy = User.Identity.Name ?? "Anonymous"; // Update CreatedBy if needed
            var eventToUpdate = await _eventService.UpdateAsync(id, updatedEvent, image);
            return Ok(eventToUpdate);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = "An unexpected error occurred", error = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "EventAdmin")]
    public async Task<IActionResult> Delete(string id)
    {
        try
        {
            await _eventService.DeleteAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound("Event not found.");
        }
    }
}
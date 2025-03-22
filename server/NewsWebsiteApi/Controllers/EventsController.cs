namespace NewsWebsiteApi.Controllers;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NewsWebsiteApi.Models;
using NewsWebsiteApi.Services;
using System.Threading.Tasks;
using System.Globalization;

[Route("api/[controller]")]
[ApiController]
public class EventsController : ControllerBase
{
    private readonly IEventService _eventService;
    private readonly IWebHostEnvironment _environment; // For file storage

    public EventsController(IEventService eventService, IWebHostEnvironment environment)
    {
        _eventService = eventService;
        _environment = environment;
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
        if (eventItem == null) return NotFound();
        return Ok(eventItem);
    }

    [HttpPost]
    //[Authorize(Roles = "Admin")]
    public async Task<ActionResult<Event>> Create()
    {
        var form = await Request.ReadFormAsync();
        
        // Convert StringValues to string and handle null/empty values
        var dateString = form["date"].ToString();
        if (string.IsNullOrEmpty(dateString) ||
            !DateTime.TryParseExact(dateString.Trim('"'), "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var parsedDate))
        {
            return BadRequest("Invalid date format. Please use YYYY-MM-DD (e.g., 2025-03-21).");
        }

        // Validate and parse other fields
        var priceString = form["price"].ToString();
        if (string.IsNullOrEmpty(priceString) || !decimal.TryParse(priceString, out var price))
        {
            return BadRequest("Invalid price format. Please enter a valid number.");
        }

        var newEvent = new Event
        {
            Title = form["title"].ToString() ?? string.Empty,
            Price = price,
            Description = form["description"].ToString() ?? string.Empty,
            Date = parsedDate,
            Time = form["time"].ToString() ?? string.Empty,
            Location = form["location"].ToString() ?? string.Empty, // Map 'location' from form to Venue
            Category = form["category"].ToString() ?? string.Empty,
            CreatedBy = User.Identity.Name ?? "Anonymous"// Assuming JWT includes username
        };

        if (form.Files.Count > 0)
        {
            var file = form.Files[0];
            if (file.Length > 0)
            {
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
                var filePath = Path.Combine(_environment.WebRootPath ?? throw new InvalidOperationException("WebRootPath is null"), "uploads", fileName);
                var directoryPath = Path.GetDirectoryName(filePath); // Ensure directory exists
                if (string.IsNullOrEmpty(directoryPath))
                {
                    return BadRequest("Invalid file path for upload.");
                }
                Directory.CreateDirectory(directoryPath);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }
                newEvent.ImageUrl = $"/uploads/{fileName}";
            }
        }

        var createdEvent = await _eventService.CreateAsync(newEvent);
        return CreatedAtAction(nameof(GetById), new { id = createdEvent.Id }, createdEvent);
    }

    [HttpPut("{id}")]
    //[Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(string id)
    {
        var existingEvent = await _eventService.GetByIdAsync(id);
        if (existingEvent == null) return NotFound();

        var form = await Request.ReadFormAsync();

        var dateString = form["date"].ToString();
        if (string.IsNullOrEmpty(dateString) ||
            !DateTime.TryParseExact(dateString.Trim('"'), "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var parsedDate))
        {
            return BadRequest("Invalid date format. Please use YYYY-MM-DD (e.g., 2025-03-21).");
        }

        var priceString = form["price"].ToString();
        if (string.IsNullOrEmpty(priceString) || !decimal.TryParse(priceString, out var price))
        {
            return BadRequest("Invalid price format. Please enter a valid number.");
        }

        // Update the existing event with new values
        existingEvent.Title = form["title"].ToString() ?? existingEvent.Title;
        existingEvent.Price = price;
        existingEvent.Description = form["description"].ToString() ?? existingEvent.Description;
        existingEvent.Date = parsedDate;
        existingEvent.Time = form["time"].ToString() ?? existingEvent.Time;
        existingEvent.Location = form["location"].ToString() ?? existingEvent.Location;
        existingEvent.Category = form["category"].ToString() ?? existingEvent.Category;

        if (form.Files.Count > 0)
        {
            var file = form.Files[0];
            if (file.Length > 0)
            {
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
                var filePath = Path.Combine(_environment.WebRootPath ?? throw new InvalidOperationException("WebRootPath is null"), "uploads", fileName);
                var directoryPath = Path.GetDirectoryName(filePath);
                if (string.IsNullOrEmpty(directoryPath))
                {
                    return BadRequest("Invalid file path for upload.");
                }
                Directory.CreateDirectory(directoryPath);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }
                existingEvent.ImageUrl = $"/uploads/{fileName}";
            }
        }

        await _eventService.UpdateAsync(id, existingEvent);
        return NoContent();
    }

    [HttpDelete("{id}")]
    //[Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(string id)
    {
        var existingEvent = await _eventService.GetByIdAsync(id);
        if (existingEvent == null) return NotFound();
        await _eventService.DeleteAsync(id);
        return NoContent();
    }
}
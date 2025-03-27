namespace NewsWebsiteApi.Services;

using MongoDB.Driver;
using NewsWebsiteApi.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

public class EventService : IEventService
{
    private readonly IMongoCollection<Event> _events;
    private readonly string _uploadsFolder;

    public EventService(IMongoDatabase database, IWebHostEnvironment environment)
    {
        _events = database.GetCollection<Event>("Events");
        _uploadsFolder = Path.Combine(environment.WebRootPath ?? throw new InvalidOperationException("WebRootPath is null"), "uploads");
        if (!Directory.Exists(_uploadsFolder))
        {
            Directory.CreateDirectory(_uploadsFolder);
        }
    }

    public async Task<List<Event>> GetAllAsync() =>
        await _events.Find(_ => true).ToListAsync();

    public async Task<Event> GetByIdAsync(string id) =>
        await _events.Find(e => e.Id == id).FirstOrDefaultAsync();

    public async Task<Event> CreateAsync(Event newEvent, IFormFile image)
    {
        // Custom validation: Ensure Date is not in the past
        if (newEvent.Date < DateTime.UtcNow.Date)
        {
            throw new ArgumentException("Event date cannot be in the past.");
        }

        // Custom validation: Validate Time format (HH:mm)
        if (!IsValidTimeFormat(newEvent.Time))
        {
            throw new ArgumentException("Time must be in the format HH:mm (e.g., 14:30).");
        }

        // Validate the image
        if (image == null)
        {
            throw new ArgumentException("Image is required when adding a new event.");
        }

        if (!IsImageFile(image))
        {
            throw new ArgumentException("Only image files (JPEG, PNG) are allowed.");
        }

        if (image.Length > 5 * 1024 * 1024) // 5MB limit
        {
            throw new ArgumentException("Image size cannot exceed 5MB.");
        }

        // Upload the image
        var fileName = Guid.NewGuid().ToString() + Path.GetExtension(image.FileName);
        var filePath = Path.Combine(_uploadsFolder, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await image.CopyToAsync(stream);
        }

        newEvent.ImageUrl = $"/uploads/{fileName}";

        await _events.InsertOneAsync(newEvent);
        return newEvent;
    }

    public async Task<Event> UpdateAsync(string id, Event updatedEvent, IFormFile? image)
    {
        var existingEvent = await _events.Find(e => e.Id == id).FirstOrDefaultAsync();
        if (existingEvent == null)
        {
            throw new KeyNotFoundException("Event not found.");
        }

        // Custom validation: Ensure Date is not in the past
        if (updatedEvent.Date < DateTime.UtcNow.Date)
        {
            throw new ArgumentException("Event date cannot be in the past.");
        }

        // Custom validation: Validate Time format (HH:mm)
        if (!IsValidTimeFormat(updatedEvent.Time))
        {
            throw new ArgumentException("Time must be in the format HH:mm (e.g., 14:30).");
        }

        // Update fields
        existingEvent.Title = updatedEvent.Title;
        existingEvent.Price = updatedEvent.Price;
        existingEvent.Description = updatedEvent.Description;
        existingEvent.Date = updatedEvent.Date;
        existingEvent.Time = updatedEvent.Time;
        existingEvent.Location = updatedEvent.Location;
        existingEvent.Category = updatedEvent.Category;

        // Handle image update
        if (image != null)
        {
            // Validate the image
            if (!IsImageFile(image))
            {
                throw new ArgumentException("Only image files (JPEG, PNG) are allowed.");
            }

            if (image.Length > 5 * 1024 * 1024) // 5MB limit
            {
                throw new ArgumentException("Image size cannot exceed 5MB.");
            }

            // Delete the old image if it exists
            if (!string.IsNullOrEmpty(existingEvent.ImageUrl))
            {
                var oldImagePath = Path.Combine(_uploadsFolder, Path.GetFileName(existingEvent.ImageUrl));
                if (File.Exists(oldImagePath))
                {
                    File.Delete(oldImagePath);
                }
            }

            // Upload the new image
            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(image.FileName);
            var filePath = Path.Combine(_uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await image.CopyToAsync(stream);
            }

            existingEvent.ImageUrl = $"/uploads/{fileName}";
        }

        await _events.ReplaceOneAsync(e => e.Id == id, existingEvent);
        return existingEvent;
    }

    public async Task DeleteAsync(string id)
    {
        var existingEvent = await _events.Find(e => e.Id == id).FirstOrDefaultAsync();
        if (existingEvent == null)
        {
            throw new KeyNotFoundException("Event not found.");
        }

        // Delete the image if it exists
        if (!string.IsNullOrEmpty(existingEvent.ImageUrl))
        {
            var imagePath = Path.Combine(_uploadsFolder, Path.GetFileName(existingEvent.ImageUrl));
            if (File.Exists(imagePath))
            {
                File.Delete(imagePath);
            }
        }

        await _events.DeleteOneAsync(e => e.Id == id);
    }

    private bool IsImageFile(IFormFile file)
    {
        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png" };
        var extension = Path.GetExtension(file.FileName).ToLower();
        return allowedExtensions.Contains(extension);
    }

    private bool IsValidTimeFormat(string time)
    {
        return TimeSpan.TryParseExact(time, "hh\\:mm", null, out _);
    }
}
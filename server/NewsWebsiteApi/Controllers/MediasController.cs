using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using NewsWebsiteApi.Models;
using NewsWebsiteApi.Services;

namespace NewsWebsiteApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MediasController : ControllerBase
    {
        private readonly IMediaService _mediaService;
        private readonly ILogger<MediasController> _logger;

        public MediasController(IMediaService mediaService, ILogger<MediasController> logger)
        {
            _mediaService = mediaService ?? throw new ArgumentNullException(nameof(mediaService));
            _logger = logger;
        }

        // ✅ Fetch All Media Items
        [HttpGet]
        public async Task<ActionResult<List<Media>>> Get()
        {
            var mediaList = await _mediaService.GetAllAsync();
            return Ok(mediaList);
        }

        // ✅ Fetch Media by ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Media>> GetById(string id)
        {
            var media = await _mediaService.GetByIdAsync(id);
            if (media == null)
            {
                _logger.LogWarning($"Media item with ID {id} not found.");
                return NotFound(new { message = "Media item not found" });
            }
            return Ok(media);
        }

        // ✅ Create New Media Item
        [HttpPost]
        [Authorize(Roles = "MediaAdmin")]
        public async Task<IActionResult> Post([FromBody] Media media)
        {
            if (media == null)
            {
                return BadRequest(new { message = "Invalid media data" });
            }

            // Validate required fields
            if (string.IsNullOrWhiteSpace(media.Title))
            {
                return BadRequest(new { message = "Title is required" });
            }

            if (string.IsNullOrWhiteSpace(media.Description))
            {
                return BadRequest(new { message = "Description is required" });
            }

            _logger.LogInformation($"Received Media Data: {JsonSerializer.Serialize(media)}");

            // Set CreatedBy and CreatedAt
            media.CreatedBy = User.Identity?.Name ?? "Unknown";
            media.CreatedAt = DateTime.UtcNow;

            await _mediaService.CreateAsync(media);
            _logger.LogInformation($"Media item created with ID: {media.Id}");

            return CreatedAtAction(nameof(GetById), new { id = media.Id }, media);
        }

        // ✅ Update Existing Media Item
        [HttpPut("{id}")]
        [Authorize(Roles = "MediaAdmin")]
        public async Task<IActionResult> Put(string id, [FromBody] Media media)
        {
            if (string.IsNullOrEmpty(id) || media == null)
            {
                _logger.LogWarning($"Invalid update request: ID or data is null");
                return BadRequest(new { message = "Invalid media data" });
            }

            // Set the Id to match the URL parameter
            media.Id = id;

            // Validate required fields
            if (string.IsNullOrWhiteSpace(media.Title))
            {
                return BadRequest(new { message = "Title is required" });
            }

            if (string.IsNullOrWhiteSpace(media.Description))
            {
                return BadRequest(new { message = "Description is required" });
            }

            var existingMedia = await _mediaService.GetByIdAsync(id);
            if (existingMedia == null)
            {
                _logger.LogWarning($"Attempted to update non-existing media item with ID: {id}");
                return NotFound(new { message = "Media item not found" });
            }

            await _mediaService.UpdateAsync(id, media);
            _logger.LogInformation($"Media item updated with ID: {id}");

            return NoContent();
        }

        // ✅ Delete Media Item
        [HttpDelete("{id}")]
        [Authorize(Roles = "MediaAdmin")]
        public async Task<IActionResult> Delete(string id)
        {
            var existingMedia = await _mediaService.GetByIdAsync(id);
            if (existingMedia == null)
            {
                _logger.LogWarning($"Attempted to delete non-existing media with ID: {id}");
                return NotFound(new { message = "Media item not found" });
            }

            await _mediaService.DeleteAsync(id);
            _logger.LogInformation($"Media item deleted with ID: {id}");
            return NoContent();
        }
    }
}
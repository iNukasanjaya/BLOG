using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Text.RegularExpressions;
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
    public class AdvertisementsController : ControllerBase
    {
        private readonly IAdvertisementService _advertisementService;
        private readonly ILogger<AdvertisementsController> _logger;

        public AdvertisementsController(IAdvertisementService advertisementService, ILogger<AdvertisementsController> logger)
        {
            _advertisementService = advertisementService ?? throw new ArgumentNullException(nameof(advertisementService));
            _logger = logger;
        }

        // ✅ Fetch All Advertisements
        [HttpGet]
        public async Task<ActionResult<List<Advertisement>>> Get()
        {
            var ads = await _advertisementService.GetAllAsync();
            return Ok(ads);
        }

        // ✅ Fetch Advertisement by ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Advertisement>> Get(string id)
        {
            var ad = await _advertisementService.GetByIdAsync(id);
            if (ad == null)
            {
                _logger.LogWarning($"Advertisement with ID {id} not found.");
                return NotFound(new { message = "Advertisement not found" });
            }
            return Ok(ad);
        }//

        // ✅ Create New Advertisement
        [HttpPost]
        [Authorize(Roles = "AdvertisementAdmin")]
        public async Task<IActionResult> Post([FromBody] Advertisement ad)
        {
            if (ad == null)
            {
                return BadRequest(new { message = "Invalid advertisement data" });
            }

            // Validate required fields
            if (string.IsNullOrWhiteSpace(ad.Title))
            {
                return BadRequest(new { message = "Title is required" });
            }

            if (string.IsNullOrWhiteSpace(ad.Number))
            {
                return BadRequest(new { message = "Phone number is required" });
            }

            // Validate phone number format (10 digits)
            if (!Regex.IsMatch(ad.Number, @"^\d{10}$"))
            {
                return BadRequest(new { message = "Phone number must be a 10-digit number" });
            }

            if (ad.Date == default(DateTime))
            {
                return BadRequest(new { message = "Date is required" });
            }

            if (string.IsNullOrWhiteSpace(ad.Description))
            {
                return BadRequest(new { message = "Description is required" });
            }

            _logger.LogInformation($"Received Ad Data: {JsonSerializer.Serialize(ad)}");

            // Set CreatedBy and CreatedAt
            ad.CreatedBy = User.Identity?.Name ?? "Unknown";
            ad.CreatedAt = DateTime.UtcNow;

            // Create Advertisement
            await _advertisementService.CreateAsync(ad);
            _logger.LogInformation($"Advertisement created with ID: {ad.Id}");

            return CreatedAtAction(nameof(Get), new { id = ad.Id }, ad);
        }

        // ✅ Update Existing Advertisement
        [HttpPut("{id}")]
        [Authorize(Roles = "AdvertisementAdmin")]
        public async Task<IActionResult> Put(string id, [FromBody] Advertisement ad)
        {
            if (ad == null || string.IsNullOrEmpty(id))
            {
                _logger.LogWarning($"Invalid update request: ID mismatch or null data");
                return BadRequest(new { message = "Invalid advertisement data" });
            }

            ad.Id = id;

            // Validate required fields
            if (string.IsNullOrWhiteSpace(ad.Title))
            {
                return BadRequest(new { message = "Title is required" });
            }

            if (string.IsNullOrWhiteSpace(ad.Number))
            {
                return BadRequest(new { message = "Phone number is required" });
            }

            if (!Regex.IsMatch(ad.Number, @"^\d{10}$"))
            {
                return BadRequest(new { message = "Phone number must be a 10-digit number" });
            }

            if (ad.Date == default(DateTime))
            {
                return BadRequest(new { message = "Date is required" });
            }

            if (string.IsNullOrWhiteSpace(ad.Description))
            {
                return BadRequest(new { message = "Description is required" });
            }

            _logger.LogInformation($"Received update request for ID: {id} with data: {JsonSerializer.Serialize(ad)}");

            var existingAd = await _advertisementService.GetByIdAsync(id);
            if (existingAd == null)
            {
                return NotFound(new { message = "Advertisement not found" });
            }

            await _advertisementService.UpdateAsync(id, ad);
            return NoContent();
        }

        // ✅ Delete Advertisement
        [HttpDelete("{id}")]
        [Authorize(Roles = "AdvertisementAdmin")]
        public async Task<IActionResult> Delete(string id)
        {
            var existingAd = await _advertisementService.GetByIdAsync(id);
            if (existingAd == null)
            {
                _logger.LogWarning($"Attempted to delete non-existing advertisement with ID: {id}");
                return NotFound(new { message = "Advertisement not found" });
            }

            await _advertisementService.DeleteAsync(id);
            _logger.LogInformation($"Advertisement deleted with ID: {id}");
            return NoContent();
        }
    }
}
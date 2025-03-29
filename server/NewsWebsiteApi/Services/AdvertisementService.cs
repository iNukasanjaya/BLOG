using NewsWebsiteApi.Models;
using MongoDB.Driver;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using System.Text.RegularExpressions;

namespace NewsWebsiteApi.Services
{
    public class AdvertisementService : IAdvertisementService
    {
        private readonly IMongoCollection<Advertisement> _advertisements;
        private readonly ILogger<AdvertisementService> _logger;

        public AdvertisementService(IMongoDatabase database, ILogger<AdvertisementService> logger)
        {
            _advertisements = database.GetCollection<Advertisement>("Advertisements");
            _logger = logger;
        }

        // ✅ Create Advertisement
        public async Task CreateAsync(Advertisement advertisement)
        {
            try
            {
                // Validate required fields
                if (string.IsNullOrWhiteSpace(advertisement.Title))
                {
                    _logger.LogWarning("Advertisement creation failed: Title is required.");
                    throw new ArgumentException("Title is required.");
                }

                if (string.IsNullOrWhiteSpace(advertisement.Number))
                {
                    _logger.LogWarning("Advertisement creation failed: Phone number is required.");
                    throw new ArgumentException("Phone number is required.");
                }

                if (!Regex.IsMatch(advertisement.Number, @"^\d{10}$"))
                {
                    _logger.LogWarning("Advertisement creation failed: Invalid phone number format.");
                    throw new ArgumentException("Phone number must be a 10-digit number.");
                }

                if (advertisement.Date == default(DateTime))
                {
                    _logger.LogWarning("Advertisement creation failed: Date is required.");
                    throw new ArgumentException("Date is required.");
                }

                if (string.IsNullOrWhiteSpace(advertisement.Description))
                {
                    _logger.LogWarning("Advertisement creation failed: Description is required.");
                    throw new ArgumentException("Description is required.");
                }

                if (string.IsNullOrEmpty(advertisement.Id))
                {
                    advertisement.Id = ObjectId.GenerateNewId().ToString(); // Ensure ObjectId is assigned
                }

                await _advertisements.InsertOneAsync(advertisement);
                _logger.LogInformation($"Advertisement created with ID: {advertisement.Id}");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error creating advertisement: {ex.Message}");
                throw;
            }
        }

        // ✅ Get All Advertisements
        public async Task<List<Advertisement>> GetAllAsync()
        {
            try
            {
                var ads = await _advertisements.Find(_ => true).ToListAsync();
                _logger.LogInformation($"Fetched {ads.Count} advertisements.");
                return ads;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching advertisements: {ex.Message}");
                throw;
            }
        }

        // ✅ Get Advertisement by ID
        public async Task<Advertisement?> GetByIdAsync(string id)
        {
            if (!ObjectId.TryParse(id, out var objectId))
            {
                _logger.LogWarning($"Invalid ObjectId format: {id}");
                return null;
            }

            try
            {
                var ad = await _advertisements.Find(a => a.Id == objectId.ToString()).FirstOrDefaultAsync();
                if (ad == null)
                {
                    _logger.LogWarning($"Advertisement with ID {id} not found.");
                }
                return ad;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error retrieving advertisement by ID {id}: {ex.Message}");
                throw;
            }
        }

        // ✅ Update Advertisement
        public async Task UpdateAsync(string id, Advertisement ad)
        {
            if (!ObjectId.TryParse(id, out var objectId))
            {
                _logger.LogWarning($"Invalid ObjectId format for update: {id}");
                return;
            }

            try
            {
                // Validate required fields
                if (string.IsNullOrWhiteSpace(ad.Title))
                {
                    _logger.LogWarning("Advertisement update failed: Title is required.");
                    throw new ArgumentException("Title is required.");
                }

                if (string.IsNullOrWhiteSpace(ad.Number))
                {
                    _logger.LogWarning("Advertisement update failed: Phone number is required.");
                    throw new ArgumentException("Phone number is required.");
                }

                if (!Regex.IsMatch(ad.Number, @"^\d{10}$"))
                {
                    _logger.LogWarning("Advertisement update failed: Invalid phone number format.");
                    throw new ArgumentException("Phone number must be a 10-digit number.");
                }

                if (ad.Date == default(DateTime))
                {
                    _logger.LogWarning("Advertisement update failed: Date is required.");
                    throw new ArgumentException("Date is required.");
                }

                if (string.IsNullOrWhiteSpace(ad.Description))
                {
                    _logger.LogWarning("Advertisement update failed: Description is required.");
                    throw new ArgumentException("Description is required.");
                }

                var result = await _advertisements.ReplaceOneAsync(a => a.Id == objectId.ToString(), ad);
                if (result.MatchedCount == 0)
                {
                    _logger.LogWarning($"Advertisement with ID {id} not found for update.");
                }
                else
                {
                    _logger.LogInformation($"Advertisement with ID {id} updated successfully.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error updating advertisement {id}: {ex.Message}");
                throw;
            }
        }

        // ✅ Delete Advertisement
        public async Task DeleteAsync(string id)
        {
            if (!ObjectId.TryParse(id, out var objectId))
            {
                _logger.LogWarning($"Invalid ObjectId format for deletion: {id}");
                return;
            }

            try
            {
                var result = await _advertisements.DeleteOneAsync(a => a.Id == objectId.ToString());
                if (result.DeletedCount == 0)
                {
                    _logger.LogWarning($"Advertisement with ID {id} not found for deletion.");
                }
                else
                {
                    _logger.LogInformation($"Advertisement with ID {id} deleted successfully.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error deleting advertisement {id}: {ex.Message}");
                throw;
            }
        }
    }
}
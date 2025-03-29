using NewsWebsiteApi.Models;
using MongoDB.Driver;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace NewsWebsiteApi.Services
{
    public class MediaService : IMediaService
    {
        private readonly IMongoCollection<Media> _media;
        private readonly ILogger<MediaService> _logger;

        public MediaService(IMongoDatabase database, ILogger<MediaService> logger)
        {
            _media = database.GetCollection<Media>("Medias");
            _logger = logger;
        }

        // ✅ Create Media
        public async Task CreateAsync(Media media)
        {
            try
            {
                if (string.IsNullOrEmpty(media.Id))
                {
                    media.Id = ObjectId.GenerateNewId().ToString(); // Ensure ObjectId is assigned
                }

                await _media.InsertOneAsync(media);
                _logger.LogInformation($"Media created with ID: {media.Id}");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error creating media: {ex.Message}");
                throw;
            }
        }

        // ✅ Get All Medias
        public async Task<List<Media>> GetAllAsync()
        {
            try
            {
                var ads = await _media.Find(_ => true).ToListAsync();
                _logger.LogInformation($"Fetched {ads.Count} medias.");
                return ads;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching medias: {ex.Message}");
                throw;
            }
        }

        // ✅ Get Media by ID
        public async Task<Media?> GetByIdAsync(string id)
        {
            if (!ObjectId.TryParse(id, out var objectId))
            {
                _logger.LogWarning($"Invalid ObjectId format: {id}");
                return null;
            }

            try
            {
                var ad = await _media.Find(a => a.Id == objectId.ToString()).FirstOrDefaultAsync();
                if (ad == null)
                {
                    _logger.LogWarning($"Media with ID {id} not found.");
                }
                return ad;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error retrieving media by ID {id}: {ex.Message}");
                throw;
            }
        }

        // ✅ Update Media
        public async Task UpdateAsync(string id, Media ad)
        {
            if (!ObjectId.TryParse(id, out var objectId))
            {
                _logger.LogWarning($"Invalid ObjectId format for update: {id}");
                return;
            }

            try
            {
                var result = await _media.ReplaceOneAsync(a => a.Id == objectId.ToString(), ad);
                if (result.MatchedCount == 0)
                {
                    _logger.LogWarning($"Media with ID {id} not found for update.");
                }
                else
                {
                    _logger.LogInformation($"Media with ID {id} updated successfully.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error updating media {id}: {ex.Message}");
                throw;
            }
        }

        // ✅ Delete Media
        public async Task DeleteAsync(string id)
        {
            if (!ObjectId.TryParse(id, out var objectId))
            {
                _logger.LogWarning($"Invalid ObjectId format for deletion: {id}");
                return;
            }

            try
            {
                var result = await _media.DeleteOneAsync(a => a.Id == objectId.ToString());
                if (result.DeletedCount == 0)
                {
                    _logger.LogWarning($"Media with ID {id} not found for deletion.");
                }
                else
                {
                    _logger.LogInformation($"Media with ID {id} deleted successfully.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error deleting media {id}: {ex.Message}");
                throw;
            }
        }
    }
}

using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace NewsWebsiteApi.Models
{
    public class Media
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;

        [BsonElement("title")]
        public string Title { get; set; } = string.Empty;  // Not 'required' here; validate before saving

        [BsonElement("description")]
        public string Description { get; set; } = string.Empty;  // Not 'required' here; validate before saving

        public string CreatedBy { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

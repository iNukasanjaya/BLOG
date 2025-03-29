namespace NewsWebsiteApi.Models;

using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

    public class Advertisement
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;

        [BsonElement("title")]
        public string Title { get; set; } = string.Empty;  // Not 'required' here; validate before saving

        [BsonElement("number")]
        public string Number { get; set; } = string.Empty;  // Not 'required' here; validate before saving

        [BsonElement("date")]
        public DateTime Date { get; set; } = DateTime.Today;// Use Date for Date fields

        [BsonElement("description")]
        public string Description { get; set; } = string.Empty;  // Not 'required' here; validate before saving

        public string CreatedBy { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }


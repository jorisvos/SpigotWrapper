using System;
using System.ComponentModel.DataAnnotations;

namespace SpigotWrapper.Models
{
    public class RamUsage
    {
        public Guid Id { get; set; }
        public DateTime? CreatedAt { get; set; }
        [Required] public long Value { get; set; }
        [Required] public Guid ServerId { get; set; }
    }
    
    public class RamUsageDto
    {
        public Guid Id { get; set; }
        public DateTime? CreatedAt { get; set; }
        public long Value { get; set; }
        public Guid ServerId { get; set; }
    }
}
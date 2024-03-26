using System;
using System.ComponentModel.DataAnnotations;

namespace SpigotWrapper.Models
{
    public class CpuUsage
    {
        public Guid Id { get; set; }
        public DateTime? CreatedAt { get; set; }
        [Required] public double Value { get; set; }
        [Required] public Guid ServerId { get; set; }
    }

    public class CpuUsageDto
    {
        public Guid Id { get; set; }
        public DateTime? CreatedAt { get; set; }
        public double Value { get; set; }
        public Guid ServerId { get; set; }
        
    }
}
using System;
using System.ComponentModel.DataAnnotations;

namespace SpigotWrapper.Models
{
    public class SpigotWrapperSetting
    {
        [Required] public string Key { get; set; }

        public string Value { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? ModifiedAt { get; set; }
    }

    public class SpigotWrapperSettingDto
    {
        public string Key { get; set; }
        public string Value { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? ModifiedAt { get; set; }
    }
}
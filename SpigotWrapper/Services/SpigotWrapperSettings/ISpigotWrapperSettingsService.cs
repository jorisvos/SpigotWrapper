using System.Collections.Generic;
using System.Threading.Tasks;
using SpigotWrapper.Models;

namespace SpigotWrapper.Services.SpigotWrapperSettings
{
    public interface ISpigotWrapperSettingsService
    {
        Task<IEnumerable<SpigotWrapperSetting>> GetAll();
        Task<SpigotWrapperSetting> Add(SpigotWrapperSetting spigotWrapper);
        Task<SpigotWrapperSetting> Update(SpigotWrapperSetting spigotWrapper);
        Task<SpigotWrapperSetting> Get(string key);
        Task Remove(string key);
    }
}
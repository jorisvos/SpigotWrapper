using System.Collections.Generic;
using System.Threading.Tasks;
using SpigotWrapper.Models;

namespace SpigotWrapper.Services.SpigotWrapperSettings
{
    public interface ISpigotWrapperSettingsService
    {
        Task<IEnumerable<SpigotWrapperSetting>> GetAll();
        Task<SpigotWrapperSetting> Add(SpigotWrapperSetting mcWrapper);
        Task<SpigotWrapperSetting> Update(SpigotWrapperSetting mcWrapper);
        Task<SpigotWrapperSetting> Get(string key);
        Task Remove(string key);
    }
}
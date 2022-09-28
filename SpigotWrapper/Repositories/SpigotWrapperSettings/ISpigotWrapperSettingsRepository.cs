using System.Collections.Generic;
using System.Threading.Tasks;
using SpigotWrapper.Models;

namespace SpigotWrapper.Repositories.SpigotWrapperSettings
{
    public interface ISpigotWrapperSettingsRepository
    {
        Task<IEnumerable<SpigotWrapperSetting>> All();
        Task<SpigotWrapperSetting> Add(SpigotWrapperSetting spigotWrapperSetting);
        Task<SpigotWrapperSetting> Get(string key);
        Task<SpigotWrapperSetting> Update(SpigotWrapperSetting spigotWrapperSetting);
        Task Remove(string key);
    }
}
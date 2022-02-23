using System.Collections.Generic;
using System.Threading.Tasks;
using SpigotWrapper.Models;

namespace SpigotWrapper.Repositories.SpigotWrapperSettings
{
    public interface ISpigotWrapperSettingsRepository
    {
        Task<IEnumerable<SpigotWrapperSetting>> All();
        Task<SpigotWrapperSetting> Add(SpigotWrapperSetting mcWrapperSetting);
        Task<SpigotWrapperSetting> Get(string key);
        Task<SpigotWrapperSetting> Update(SpigotWrapperSetting mcWrapperSetting);
        Task Remove(string key);
    }
}
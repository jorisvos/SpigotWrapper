using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SpigotWrapper.Models;
using SpigotWrapper.Repositories.SpigotWrapperSettings;

namespace SpigotWrapper.Services.SpigotWrapperSettings
{
    public class SpigotWrapperSettingsService : ISpigotWrapperSettingsService
    {
        private readonly ISpigotWrapperSettingsRepository _spigotWrapperRepository;

        public SpigotWrapperSettingsService(ISpigotWrapperSettingsRepository spigotWrapperRepository)
        {
            _spigotWrapperRepository = spigotWrapperRepository;
        }

        public async Task<IEnumerable<SpigotWrapperSetting>> GetAll()
        {
            return await _spigotWrapperRepository.All();
        }

        public async Task<SpigotWrapperSetting> Add(SpigotWrapperSetting spigotWrapper)
        {
            var spigotWrapperSettings = await _spigotWrapperRepository.All();
            if (spigotWrapperSettings.Any(m => m.Key == spigotWrapper.Key))
                throw new Exception("You can't have settings with the same key.");

            return await _spigotWrapperRepository.Add(spigotWrapper);
        }

        public async Task<SpigotWrapperSetting> Update(SpigotWrapperSetting spigotWrapper)
        {
            return await _spigotWrapperRepository.Update(spigotWrapper);
        }

        public async Task<SpigotWrapperSetting> Get(string key)
        {
            return await _spigotWrapperRepository.Get(key);
        }

        public async Task Remove(string key)
        {
            await _spigotWrapperRepository.Remove(key);
        }
    }
}
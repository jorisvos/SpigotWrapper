using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SpigotWrapper.Models;
using SpigotWrapper.Repositories.SpigotWrapperSettings;
using SpigotWrapperLib.Log;

namespace SpigotWrapper.Services.SpigotWrapperSettings
{
    public class SpigotWrapperSettingsService : ISpigotWrapperSettingsService
    {
        private readonly ISpigotWrapperSettingsRepository _spigotWrapperRepository;
        private readonly Logger _logger;

        public SpigotWrapperSettingsService(ISpigotWrapperSettingsRepository spigotWrapperRepository)
        {
            _spigotWrapperRepository = spigotWrapperRepository;
            _logger = new Logger(GetType().Name);
        }

        public async Task<IEnumerable<SpigotWrapperSetting>> GetAll()
        {
            return await _spigotWrapperRepository.All();
        }

        public async Task<SpigotWrapperSetting> Add(SpigotWrapperSetting spigotWrapper)
        {
            var spigotWrapperSettings = await _spigotWrapperRepository.All();
            if (spigotWrapperSettings.Any(m => m.Key == spigotWrapper.Key))
            {
                _logger.Error("You can't have settings with the same key.");
                throw new Exception("You can't have settings with the same key.");
            }

            _logger.Info($"Adding {spigotWrapper.Key}");
            return await _spigotWrapperRepository.Add(spigotWrapper);
        }

        public async Task<SpigotWrapperSetting> Update(SpigotWrapperSetting spigotWrapper)
        {
            _logger.Info($"Updating {spigotWrapper.Key}");
            return await _spigotWrapperRepository.Update(spigotWrapper);
        }

        public async Task<SpigotWrapperSetting> Get(string key)
        {
            return await _spigotWrapperRepository.Get(key);
        }

        public async Task Remove(string key)
        {
            _logger.Info($"Removing {key}");
            await _spigotWrapperRepository.Remove(key);
        }
    }
}
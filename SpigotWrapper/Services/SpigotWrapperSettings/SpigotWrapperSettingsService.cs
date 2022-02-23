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
        private readonly ISpigotWrapperSettingsRepository _mcWrapperRepository;

        public SpigotWrapperSettingsService(ISpigotWrapperSettingsRepository mcWrapperRepository)
        {
            _mcWrapperRepository = mcWrapperRepository;
        }

        public async Task<IEnumerable<SpigotWrapperSetting>> GetAll()
        {
            return await _mcWrapperRepository.All();
        }

        public async Task<SpigotWrapperSetting> Add(SpigotWrapperSetting mcWrapper)
        {
            var mcWrapperSettings = await _mcWrapperRepository.All();
            if (mcWrapperSettings.Any(m => m.Key == mcWrapper.Key))
                throw new Exception("You can't have settings with the same key.");

            return await _mcWrapperRepository.Add(mcWrapper);
        }

        public async Task<SpigotWrapperSetting> Update(SpigotWrapperSetting mcWrapper)
        {
            return await _mcWrapperRepository.Update(mcWrapper);
        }

        public async Task<SpigotWrapperSetting> Get(string key)
        {
            return await _mcWrapperRepository.Get(key);
        }

        public async Task Remove(string key)
        {
            await _mcWrapperRepository.Remove(key);
        }
    }
}
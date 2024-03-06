using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using SpigotWrapper.Models;
using SpigotWrapper.Repositories.Plugins;
using SpigotWrapperLib;
using SpigotWrapperLib.Log;

namespace SpigotWrapper.Services.Plugins
{
    public class PluginService : IPluginService
    {
        public static readonly string PluginPath = Path.Combine(Main.RootPath, "plugins");
        private readonly IPluginRepository _pluginRepository;
        private readonly Logger _logger;

        public PluginService(IPluginRepository pluginRepository)
        {
            _pluginRepository = pluginRepository;
            _logger = new Logger(GetType().Name);
        }

        public async Task<IEnumerable<Plugin>> GetAll()
        {
            return await _pluginRepository.All();
        }

        public async Task<Plugin> Add(Plugin plugin, IFormFile file)
        {
            plugin.FileName = file.FileName;

            var plugins = await _pluginRepository.All();
            if (plugins.Any(p => p.Name == plugin.Name || p.FileName == plugin.FileName))
            {
                _logger.Error("The plugin name and filename must be unique.");
                throw new Exception("The plugin name and filename must be unique.");
            }

            var uploadedPlugin = await _pluginRepository.Add(plugin);

            var filePath = Path.Combine(PluginPath, plugin.FileName);

            await using var stream = File.Create(filePath);
            await file.CopyToAsync(stream);
            _logger.Info($"Added {plugin.FileName} ({plugin.Version})");

            return uploadedPlugin;
        }

        public async Task<Plugin> Get(Guid id)
        {
            return await _pluginRepository.Get(id);
        }

        public async Task Remove(Guid id)
        {
            var plugin = await _pluginRepository.Get(id);
            await _pluginRepository.Remove(id);
            File.Delete(Path.Combine(PluginPath, plugin.FileName));
            _logger.Info($"Removed {plugin.Name}");
        }
    }
}
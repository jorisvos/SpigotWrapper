using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using SpigotWrapper.Models;

namespace SpigotWrapper.Repositories.Plugins
{
    public interface IPluginRepository
    {
        Task<IEnumerable<PluginModel>> All();
        Task<PluginModel> Add(PluginModel plugin);
        Task<PluginModel> Get(Guid id);
        Task Remove(Guid id);
    }
}
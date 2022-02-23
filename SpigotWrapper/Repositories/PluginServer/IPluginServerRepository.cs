using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SpigotWrapper.Repositories.PluginServer
{
    public interface IPluginServerRepository
    {
        Task<IEnumerable<Models.PluginServer>> All();
        Task<Models.PluginServer> Add(Models.PluginServer pluginServer);
        Task<Models.PluginServer> Get(Guid id);
        Task Remove(Guid id);
        Task<IEnumerable<Models.PluginServer>> AllByServerId(Guid serverId);
    }
}
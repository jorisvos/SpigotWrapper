using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SpigotWrapper.Repositories.RamUsage
{
    public interface IRamUsageRepository
    {
        Task<IEnumerable<Models.RamUsage>> All();
        Task<Models.RamUsage> Add(Models.RamUsage ramUsage);
        Task<IEnumerable<Models.RamUsage>> Get(Guid serverId, int count = 100);
        Task Remove(Guid id);
    }
}


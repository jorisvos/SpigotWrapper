using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SpigotWrapper.Repositories.CpuUsage
{
    public interface ICpuUsageRepository
    {
        Task<IEnumerable<Models.CpuUsage>> All();
        Task<Models.CpuUsage> Add(Models.CpuUsage cpuUsage);
        Task<IEnumerable<Models.CpuUsage>> Get(Guid serverId, int count = 100);
        Task Remove(Guid serverId, DateTime createdAt);
    }
}


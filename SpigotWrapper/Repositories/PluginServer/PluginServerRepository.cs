using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using AutoMapper;
using Dapper;
using SpigotWrapper.Models;
using SpigotWrapper.Postgres;

namespace SpigotWrapper.Repositories.PluginServer
{
    public class PluginServerRepository : PostgresRepository<Models.PluginServer, PluginServerDto>,
        IPluginServerRepository
    {
        public PluginServerRepository(IDbConnection dbConnection, IMapper mapper) : base(dbConnection, mapper)
        {
        }

        public async Task<IEnumerable<Models.PluginServer>> AllByServerId(Guid serverId)
        {
            var result = await DbConnection.QueryAsync<PluginServerDto>(@"
                select *
                from plugin_server
                where server_id = @serverId
            ", new { serverId });

            return Mapper.Map<IEnumerable<PluginServerDto>, IEnumerable<Models.PluginServer>>(result);
        }
    }
}
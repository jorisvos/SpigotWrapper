using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using AutoMapper;
using Dapper;
using SpigotWrapper.Models;
using SpigotWrapper.Postgres;

namespace SpigotWrapper.Repositories.Servers
{
    public class ServerRepository : PostgresRepository<Server, ServerDto>, IServerRepository
    {
        public ServerRepository(IDbConnection dbConnection, IMapper mapper) : base(dbConnection, mapper)
        {
        }

        public async Task<IEnumerable<Server>> AllByJarId(Guid jarId)
        {
            var result = await DbConnection.QueryAsync<ServerDto>(@"
                select *
                from server
                where jar_file = @jarId
            ", new { jarId });

            return Mapper.Map<IEnumerable<ServerDto>, IEnumerable<Server>>(result);
        }
    }
}
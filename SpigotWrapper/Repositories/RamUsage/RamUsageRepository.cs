using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using AutoMapper;
using Dapper;
using SpigotWrapper.Models;
using SpigotWrapper.Postgres;

namespace SpigotWrapper.Repositories.RamUsage
{
    public class RamUsageRepository : PostgresRepository<Models.RamUsage, RamUsageDto>,
        IRamUsageRepository
    {
        public RamUsageRepository(IDbConnection dbConnection, IMapper mapper) : base(dbConnection, mapper)
        {
        }
        
        protected override string[] PrimaryKeyColumns { get; } = { "Id" };
        public async Task<IEnumerable<Models.RamUsage>> Get(Guid serverId, int count = 100)
        {
            var result = await DbConnection.QueryAsync<RamUsageDto>($@"
                select *
                from {TableName}
                where server_id = @serverId
                limit @count
            ", new { serverId, count });

            return Mapper.Map<IEnumerable<RamUsageDto>, IEnumerable<Models.RamUsage>>(result);
        }

        public async Task Remove(Guid serverId, DateTime createdAt)
        {
            await DbConnection.ExecuteAsync($@"delete from {TableName} where server_id = @serverId and created_at = @createdAt", new { serverId, createdAt });
        }
    }
}
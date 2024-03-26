using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using AutoMapper;
using Dapper;
using SpigotWrapper.Models;
using SpigotWrapper.Postgres;

namespace SpigotWrapper.Repositories.CpuUsage
{
    public class CpuUsageRepository : PostgresRepository<Models.CpuUsage, CpuUsageDto>,
        ICpuUsageRepository
    {
        public CpuUsageRepository(IDbConnection dbConnection, IMapper mapper) : base(dbConnection, mapper)
        {
        }
        
        protected override string[] PrimaryKeyColumns { get; } = { "Id" };
        
        public async Task<IEnumerable<Models.CpuUsage>> Get(Guid serverId, int count = 100)
        {
            var result = await DbConnection.QueryAsync<CpuUsageDto>($@"
                select *
                from {TableName}
                where server_id = @serverId
                limit @count
            ", new { serverId, count });

            return Mapper.Map<IEnumerable<CpuUsageDto>, IEnumerable<Models.CpuUsage>>(result);
        }

        public async Task Remove(Guid serverId, DateTime createdAt)
        {
            await DbConnection.ExecuteAsync($@"delete from {TableName} where server_id = @serverId and created_at = @createdAt", new { serverId, createdAt });
        }
    }
}
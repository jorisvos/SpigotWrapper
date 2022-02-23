using System.Data;
using System.Threading.Tasks;
using AutoMapper;
using Dapper;
using SpigotWrapper.Models;
using SpigotWrapper.Postgres;

namespace SpigotWrapper.Repositories.SpigotWrapperSettings
{
    public class SpigotWrapperSettingsRepository : PostgresRepository<SpigotWrapperSetting, SpigotWrapperSettingDto>,
        ISpigotWrapperSettingsRepository
    {
        public SpigotWrapperSettingsRepository(IDbConnection dbConnection, IMapper mapper) : base(dbConnection, mapper)
        {
        }

        protected override string[] PrimaryKeyColumns { get; } = { "Key" };

        public async Task<SpigotWrapperSetting> Get(string key)
        {
            var result =
                await DbConnection.QuerySingleOrDefaultAsync<SpigotWrapperSettingDto>(
                    $@"select * from {TableName} where key = @key", new { key });

            return Mapper.Map<SpigotWrapperSettingDto, SpigotWrapperSetting>(result);
        }

        public async Task Remove(string key)
        {
            await DbConnection.ExecuteAsync($@"delete from {TableName} where key = @key", new { key });
        }
    }
}
using System.Data;
using AutoMapper;
using SpigotWrapper.Models;
using SpigotWrapper.Postgres;

namespace SpigotWrapper.Repositories.Plugins
{
    public class PluginRepository : PostgresRepository<Plugin, PluginDto>, IPluginRepository
    {
        public PluginRepository(IDbConnection dbConnection, IMapper mapper) : base(dbConnection, mapper)
        {
        }
    }
}
using System.Data;
using AutoMapper;
using SpigotWrapper.Models;
using SpigotWrapper.Postgres;

namespace SpigotWrapper.Repositories.Servers
{
    public class ServerRepository : PostgresRepository<Server, ServerDto>, IServerRepository
    {
        public ServerRepository(IDbConnection dbConnection, IMapper mapper) : base(dbConnection, mapper)
        {
        }
    }
}
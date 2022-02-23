using System.Data;
using AutoMapper;
using SpigotWrapper.Models;
using SpigotWrapper.Postgres;

namespace SpigotWrapper.Repositories.Jars
{
    public class JarRepository : PostgresRepository<Jar, JarDto>, IJarRepository
    {
        public JarRepository(IDbConnection dbConnection, IMapper mapper) : base(dbConnection, mapper)
        {
        }
    }
}
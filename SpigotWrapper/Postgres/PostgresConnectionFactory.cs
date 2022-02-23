using System.Data;
using Npgsql;

namespace SpigotWrapper.Postgres
{
    public class PostgresConnectionFactory
    {
        public static IDbConnection CreatePostgresConnection(PostgresOptions settings)
        {
            return new NpgsqlConnection(settings.ConnectionString);
        }
    }
}
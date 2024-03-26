using System.Data;
using Npgsql;

namespace SpigotWrapper.Postgres
{
    public static class PostgresConnectionFactory
    {
        public static IDbConnection CreatePostgresConnection(PostgresOptions settings)
        {
            return new NpgsqlConnection(settings.ConnectionString);
        }
    }
}
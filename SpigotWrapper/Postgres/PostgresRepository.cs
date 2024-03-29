using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.Configuration.Annotations;
using Dapper;

namespace SpigotWrapper.Postgres
{
    public abstract class PostgresRepository<TModel, TDto>
        where TModel : class
        where TDto : class
    {
        protected PostgresRepository(IDbConnection dbConnection, IMapper mapper)
        {
            DbConnection = dbConnection;
            Mapper = mapper;

            TableName = $"{ToSnakeCase(typeof(TDto).Name[..^3])}";
        }

        protected IDbConnection DbConnection { get; }
        protected IMapper Mapper { get; }
        protected virtual string[] PrimaryKeyColumns { get; } = { "Id" };
        protected virtual string[] AutoGeneratedColumns { get; } = { "Id", "CreatedAt" };
        protected string TableName { get; }

        public async Task Remove(Guid id)
        {
            await DbConnection.ExecuteAsync($@"delete from {TableName} where id = @id", new { id });
        }

        public virtual async Task<TModel> Get(Guid id)
        {
            var result =
                await DbConnection.QuerySingleOrDefaultAsync<TDto>($@"select * from {TableName} where id = @Id",
                    new { Id = id });

            return Mapper.Map<TDto, TModel>(result);
        }

        public virtual async Task<IEnumerable<TModel>> All()
        {
            var result =
                await DbConnection.QueryAsync<TDto>(
                    $@"select * from {TableName} order by greatest(created_at, modified_at) desc");

            if (result == null)
                throw new Exception("Something went wrong when retrieving all records from postgres.");

            return Mapper.Map<IEnumerable<TDto>, IEnumerable<TModel>>(result);
        }

        public virtual async Task<TModel> Add(TModel obj)
        {
            var dtoObj = Mapper.Map<TModel, TDto>(obj);

            if (dtoObj == null)
                throw new ArgumentNullException(nameof(dtoObj));

            var properties = typeof(TDto)
                .GetProperties(BindingFlags.Instance | BindingFlags.Public)
                .Where(prop =>
                    !Attribute.IsDefined(prop, typeof(KeyAttribute)) &&
                    !Attribute.IsDefined(prop, typeof(IgnoreAttribute)))
                .Select(x => x.Name).ToArray();

            var propertiesToInsert = properties.Where(p => !AutoGeneratedColumns.Contains(p)).ToList();

            var bob = new StringBuilder();
            bob.AppendLine($"insert into {TableName} (");
            bob.AppendLine(string.Join(", ", propertiesToInsert.Select(ToSnakeCase).Select(s => "\"" + s + "\"")));
            bob.AppendLine(") values (");
            bob.AppendLine(string.Join(", ", propertiesToInsert.Select(s => "@" + s)));
            bob.AppendLine(") returning *");

            return Mapper.Map<TDto, TModel>(await DbConnection.QuerySingleAsync<TDto>(bob.ToString(), dtoObj));
        }

        public virtual async Task<TModel> Update(TModel obj)
        {
            var dtoObj = Mapper.Map<TModel, TDto>(obj);

            if (dtoObj == null)
                throw new ArgumentNullException(nameof(dtoObj));

            ((dynamic)dtoObj).ModifiedAt = DateTime.Now;

            var properties = typeof(TDto)
                .GetProperties(BindingFlags.Instance | BindingFlags.Public)
                .Where(prop =>
                    !Attribute.IsDefined(prop, typeof(KeyAttribute)) &&
                    !Attribute.IsDefined(prop, typeof(IgnoreAttribute)))
                .Select(x => x.Name).ToArray();

            var propertiesToUpdate = properties.Where(p => !AutoGeneratedColumns.Contains(p)).ToList();

            var bob = new StringBuilder();
            bob.AppendLine($"update {TableName} set ");
            bob.AppendLine(string.Join(", ", propertiesToUpdate.Select(CreateFieldSetter)));
            bob.AppendLine("where");
            bob.AppendLine(string.Join(", ", PrimaryKeyColumns.Select(CreateFieldSetter)));
            bob.AppendLine("returning *");

            return Mapper.Map<TDto, TModel>(await DbConnection.QuerySingleAsync<TDto>(bob.ToString(), dtoObj));
        }

        private static string CreateFieldSetter(string field)
        {
            var snakeCasedField = ToSnakeCase(field);

            return field == "ModifiedAt" ? $"\"{snakeCasedField}\" = now()" : $"\"{snakeCasedField}\" = @{field}";
        }

        private static string ToSnakeCase(string input)
        {
            if (string.IsNullOrEmpty(input)) return input;

            var startUnderscores = Regex.Match(input, @"^_+");
            return startUnderscores + Regex.Replace(input, @"([a-z0-9])([A-Z])", "$1_$2").ToLower();
        }
    }
}
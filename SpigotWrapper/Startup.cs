using System.IO;
using System.IO.Compression;
using System.Text.Json.Serialization;
using Dapper;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Npgsql;
using SpigotWrapper.Config;
using SpigotWrapper.Config.Mapping;
using SpigotWrapper.Postgres;
using SpigotWrapper.Repositories.Jars;
using SpigotWrapper.Repositories.Plugins;
using SpigotWrapper.Repositories.PluginServer;
using SpigotWrapper.Repositories.Servers;
using SpigotWrapper.Repositories.SpigotWrapperSettings;
using SpigotWrapper.Services.Jars;
using SpigotWrapper.Services.Plugins;
using SpigotWrapper.Services.Servers;
using SpigotWrapper.Services.SpigotWrapperSettings;
using SpigotWrapperLib;

namespace SpigotWrapper
{
    public class Startup
    {
        private const string MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public static IConfiguration Configuration { get; private set; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddOptions();

            services.Configure<GzipCompressionProviderOptions>(options => options.Level = CompressionLevel.Optimal);
            services.AddResponseCompression();

            services
                .AddMvc(options => options.EnableEndpointRouting = false)
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
                    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
                })
                .AddControllersAsServices();

            services.Configure<PostgresOptions>(Configuration.GetSection("Postgres"));

            services.AddTransient(p =>
                PostgresConnectionFactory.CreatePostgresConnection(p.GetRequiredService<IOptions<PostgresOptions>>()
                    .Value));
            NpgsqlConnection.GlobalTypeMapper.MapEnum<JarKind>();
            NpgsqlConnection.GlobalTypeMapper.MapEnum<Error>();

            // Repositories
            services.AddTransient<IJarRepository, JarRepository>();
            services.AddTransient<IPluginRepository, PluginRepository>();
            services.AddTransient<IServerRepository, ServerRepository>();
            services.AddTransient<IPluginServerRepository, PluginServerRepository>();
            services.AddTransient<ISpigotWrapperSettingsRepository, SpigotWrapperSettingsRepository>();

            DefaultTypeMap.MatchNamesWithUnderscores = true;

            services.AddRouting(options =>
            {
                options.AppendTrailingSlash = true;
                options.LowercaseUrls = true;
            });

            // Services
            services.AddTransient<IJarService, JarService>();
            services.AddTransient<IPluginService, PluginService>();
            services.AddTransient<IServerService, ServerService>();
            services.AddTransient<ISpigotWrapperSettingsService, SpigotWrapperSettingsService>();

            services.AddApiVersioning(o =>
            {
                o.AssumeDefaultVersionWhenUnspecified = true;
                o.ReportApiVersions = true;
                o.DefaultApiVersion = new ApiVersion(1, 0);
            });

            services.AddVersionedApiExplorer(options =>
            {
                options.SubstituteApiVersionInUrl = true;
                options.GroupNameFormat = "'v'VVV";
            });

            services.AddSwaggerGen(options => options.CustomSchemaIds(type => type.ToString()));
            services.AddAutoMapper();

            services.AddCors(options =>
            {
                options.AddPolicy(MyAllowSpecificOrigins, builder => { 
                    builder.WithOrigins("http://localhost:3000").AllowAnyMethod();
                    builder.WithOrigins("https://spigot-wrapper.local");
                });
            });

            services.AddDataProtection();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseDeveloperExceptionPage();
            app.UseSwagger();
            app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "SpigotWrapper v1"));

            app.UseHttpsRedirection();
            app.UseRouting();
            app.UseCors(MyAllowSpecificOrigins);

            if (env.IsDevelopment())
                app.UseDeveloperExceptionPage();
            else
                app.UseHsts();

            app.UseAuthorization();
            app.UseEndpoints(endpoints => { endpoints.MapControllers(); });

            Main.Initialize();
            CreateDirectories();
        }
        
        public static void CreateDirectories()
        {
            Directory.CreateDirectory(JarService.JarPath);
            Directory.CreateDirectory(ServerService.ServerPath);
            Directory.CreateDirectory(PluginService.PluginPath);
        }
    }
}
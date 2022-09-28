using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using SpigotWrapper.Config.Mapping;
using SpigotWrapper.Models;
using SpigotWrapper.Postgres;
using SpigotWrapper.Repositories.Jars;
using SpigotWrapper.Repositories.Plugins;
using SpigotWrapper.Repositories.PluginServer;
using SpigotWrapper.Repositories.Servers;
using SpigotWrapper.Repositories.SpigotWrapperSettings;
using SpigotWrapper.Services.Jars;
using SpigotWrapperLib;
using SpigotWrapperLib.Server;

namespace SpigotWrapper.Services.Servers
{
    public class ServerService : IServerService
    {
        public static readonly string ServerPath = Path.Combine(Main.RootPath, "servers");
        private readonly IJarService _jarService;
        private readonly ILogger<ServerService> _logger;
        private readonly IMapper _mapper;
        private readonly ISpigotWrapperSettingsRepository _spigotWrapperRepository;
        private readonly IPluginRepository _pluginRepository;
        private readonly IPluginServerRepository _pluginServerRepository;
        private readonly IServerRepository _serverRepository;

        static ServerService()
        {
            var collection = new ServiceCollection();
            collection.AddTransient<IServerRepository, ServerRepository>();
            collection.AddTransient<ISpigotWrapperSettingsRepository, SpigotWrapperSettingsRepository>();
            collection.AddTransient<IPluginRepository, PluginRepository>();
            collection.AddTransient<IPluginServerRepository, PluginServerRepository>();
            collection.AddTransient<IJarRepository, JarRepository>();
            collection.AddTransient<IJarService, JarService>();
            collection.AddTransient(p => PostgresConnectionFactory.CreatePostgresConnection(new PostgresOptions
            {
                ConnectionString = Startup.Configuration.GetSection("Postgres")["ConnectionString"]
            }));
            collection.AddAutoMapper();

            var service = collection.BuildServiceProvider();
            var serverRepository = service.GetService<IServerRepository>();
            var spigotWrapperRepository = service.GetService<ISpigotWrapperSettingsRepository>();
            var pluginRepository = service.GetService<IPluginRepository>();
            var pluginServerRepository = service.GetService<IPluginServerRepository>();
            var mapper = service.GetService<IMapper>();
            var jarService = service.GetService<IJarService>();

            var servers = serverRepository.All().GetAwaiter().GetResult();
            var libServers = new List<Wrapper>();
            if (servers.Any())
            {
                var javaExecutable = spigotWrapperRepository.Get("JavaExecutable").GetAwaiter().GetResult().Value;
                foreach (var server in servers)
                {
                    EnrichWithEnabledPlugins(server, pluginRepository, pluginServerRepository).GetAwaiter();
                    var libServer = mapper.Map<Server, Wrapper>(server);
                    libServer.ServerPath = Path.Combine(ServerPath, libServer.Id.ToString());
                    libServer.JavaExecutable = javaExecutable;
                    libServer.JarFilePath = jarService.GetJarPath(server.JarFile).GetAwaiter().GetResult();
                    libServers.Add(libServer);
                }
            }

            ServerManager = new ServerManager(libServers);
        }

        public ServerService(IServerRepository serverRepository,
            IPluginRepository pluginRepository,
            IPluginServerRepository pluginServerRepository,
            ISpigotWrapperSettingsRepository spigotWrapperRepository,
            IJarService jarService,
            IMapper mapper,
            ILogger<ServerService> logger)
        {
            _serverRepository = serverRepository;
            _pluginRepository = pluginRepository;
            _pluginServerRepository = pluginServerRepository;
            _spigotWrapperRepository = spigotWrapperRepository;
            _jarService = jarService;
            _mapper = mapper;
            _logger = logger;
        }

        public static ServerManager ServerManager { get; }

        #region Database operations

        public async Task<IEnumerable<Server>> GetAll()
        {
            return await _serverRepository.All();
        }

        public async Task<Server> Add(Server server)
        {
            var servers = await _serverRepository.All();
            var jars = await _jarService.GetAll();
            if (servers.Any(s => s.Name == server.Name))
                throw new Exception("The name of the server must be unique.");
            if (jars.All(j => j.Id != server.JarFile))
                throw new Exception("That jar file does not exist.");

            var createdServer = await _serverRepository.Add(server);
            var libServer = _mapper.Map<Server, Wrapper>(createdServer);
            libServer.ServerPath = Path.Combine(ServerPath, libServer.Id.ToString());
            libServer.JarFilePath = await _jarService.GetJarPath(server.JarFile);

            try
            {
                var javaExecutable = (await _spigotWrapperRepository.Get("JavaExecutable")).Value;
                libServer.JavaExecutable = javaExecutable;

                var result = ServerManager.CreateServer(libServer);
                if (result)
                    return createdServer;

                await _serverRepository.Remove(createdServer.Id);
                throw new Exception("ERROR: CONTACT CREATOR OF SpigotWrapper!");
            }
            catch (Exception)
            {
                await _serverRepository.Remove(createdServer.Id);
                throw new Exception("ERROR: There was no JavaExecutable setting found in the database.");
            }
        }

        public async Task<Server> Get(Guid id, bool enrichEnabledPlugins)
        {
            var server = await _serverRepository.Get(id);
            if (enrichEnabledPlugins)
                await EnrichWithEnabledPlugins(server, _pluginRepository, _pluginServerRepository);
            return server;
        }

        public async Task Remove(Guid id)
        {
            var server = await _serverRepository.Get(id);
            if (server == null)
                throw new Exception("A server with that id cannot be found.");
            var serverPath = Path.Combine(ServerPath, server.Id.ToString());

            var deleted = ServerManager.Instance.DeleteServer(id);
            if (!deleted)
                throw new Exception("A server with that id cannot be found.");

            Directory.Delete(serverPath, true);
            await _serverRepository.Remove(id);
        }

        private static async Task EnrichWithEnabledPlugins(Server server, IPluginRepository pluginRepository,
            IPluginServerRepository pluginServerRepository)
        {
            if (server != null)
            {
                var pluginsServer = await pluginServerRepository.AllByServerId(server.Id);
                var plugins = new List<Plugin>();
                foreach (var pluginServer in pluginsServer)
                    plugins.Add(await pluginRepository.Get(pluginServer.PluginId));
                server.EnabledPlugins = plugins.ToArray();
            }
        }

        #endregion
    }
}
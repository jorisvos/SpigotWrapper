using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.Extensions.DependencyInjection;
using SpigotWrapper.Config;
using SpigotWrapper.Config.Mapping;
using SpigotWrapper.Models;
using SpigotWrapper.Postgres;
using SpigotWrapper.Repositories.CpuUsage;
using SpigotWrapper.Repositories.Jars;
using SpigotWrapper.Repositories.Plugins;
using SpigotWrapper.Repositories.PluginServer;
using SpigotWrapper.Repositories.RamUsage;
using SpigotWrapper.Repositories.Servers;
using SpigotWrapper.Repositories.SpigotWrapperSettings;
using SpigotWrapper.Services.Jars;
using SpigotWrapperLib;
using SpigotWrapperLib.Log;
using SpigotWrapperLib.Plugin;
using SpigotWrapperLib.Server;

namespace SpigotWrapper.Services.Servers
{
    public class ServerService : IServerService
    {
        public static readonly string ServerPath = Path.Combine(Main.RootPath, "servers");
        private static bool _saveUsageThreadRunning = false;
        private static bool _stopSaveUsageThread = false;
        
        private readonly IJarService _jarService;
        private readonly IMapper _mapper;
        private readonly Logger _logger;
        private readonly IServiceProvider _serviceProvider;
        private readonly ISpigotWrapperSettingsRepository _spigotWrapperRepository;
        private readonly IPluginRepository _pluginRepository;
        private readonly IPluginServerRepository _pluginServerRepository;
        private readonly IServerRepository _serverRepository;
        private readonly IRamUsageRepository _ramUsageRepository;
        private readonly ICpuUsageRepository _cpuUsageRepository;

        static ServerService()
        {
            var collection = new ServiceCollection();
            collection.AddTransient<IServerRepository, ServerRepository>();
            collection.AddTransient<ISpigotWrapperSettingsRepository, SpigotWrapperSettingsRepository>();
            collection.AddTransient<IPluginRepository, PluginRepository>();
            collection.AddTransient<IPluginServerRepository, PluginServerRepository>();
            collection.AddTransient<IJarRepository, JarRepository>();
            collection.AddTransient<IJarService, JarService>();
            collection.AddTransient(_ => PostgresConnectionFactory.CreatePostgresConnection(new PostgresOptions
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

            var servers = serverRepository!.All().GetAwaiter().GetResult();
            var libServers = new List<Wrapper>();
            if ((servers ?? Array.Empty<Server>()).Any())
            {
                var javaExecutable = spigotWrapperRepository!.Get("JavaExecutable").GetAwaiter().GetResult().Value;
                foreach (var server in servers!)
                {
                    EnrichWithEnabledPlugins(server, pluginRepository, pluginServerRepository).GetAwaiter().GetResult();
                    var libServer = mapper!.Map<Server, Wrapper>(server);
                    libServer.ServerPath = Path.Combine(ServerPath, libServer.Id.ToString());
                    libServer.JavaExecutable = javaExecutable;
                    libServer.JarFilePath = jarService!.GetJarPath(server.JarFile).GetAwaiter().GetResult();
                    libServers.Add(libServer);
                }
            }

            ServerManager = new ServerManager(libServers);
        }

        public ServerService(IServerRepository serverRepository,
            IPluginRepository pluginRepository,
            IPluginServerRepository pluginServerRepository,
            ISpigotWrapperSettingsRepository spigotWrapperRepository,
            IRamUsageRepository ramUsageRepository,
            ICpuUsageRepository cpuUsageRepository,
            IJarService jarService,
            IMapper mapper,
            IServiceProvider serviceProvider)
        {
            _serverRepository = serverRepository;
            _pluginRepository = pluginRepository;
            _pluginServerRepository = pluginServerRepository;
            _spigotWrapperRepository = spigotWrapperRepository;
            _ramUsageRepository = ramUsageRepository;
            _cpuUsageRepository = cpuUsageRepository;
            _jarService = jarService;
            _mapper = mapper;
            _logger = new Logger(GetType().Name);
            _serviceProvider = serviceProvider;
        }

        public static ServerManager ServerManager { get; }

        #region Database operations

        public bool StartServer(Guid id)
        {
            if (_saveUsageThreadRunning)
                return ServerManager.StartServer(id);
            _saveUsageThreadRunning = true;
            Task.Factory.StartNew(SaveUsage);
            // new Thread(SaveUsage).Start();
            return ServerManager.StartServer(id);
        }

        private void SaveUsage()
        {
            while (!_stopSaveUsageThread)
            {
                ServerManager.ServersUsage(AddUsage);
                Thread.Sleep(1000);
                if (ServerManager.IsNoServersRunning())
                    _stopSaveUsageThread = true;
            }
            _stopSaveUsageThread = false;
            _saveUsageThreadRunning = false;
        }

        private void AddUsage(Guid serverId, long ramUsage, double cpuUsage)
        {
            //TODO: fix (doesnt save to database, probably because it runs on a separate thread).
            Console.WriteLine(
                $"{DateTime.Now} {DateTime.Now.Millisecond} - RamUsage: {ramUsage} - CpuUsage: {cpuUsage}");
            _ramUsageRepository.Add(new RamUsage
            {
                Value = ramUsage,
                ServerId = serverId
            });
            _cpuUsageRepository.Add(new CpuUsage
            {
                Value = cpuUsage,
                ServerId = serverId
            });
        }

        public async Task<IEnumerable<Server>> GetAll()
        {
            return await _serverRepository.All();
        }

        public async Task<Server> Add(Server server)
        {
            var servers = await _serverRepository.All();
            var jars = await _jarService.GetAll();
            if (servers.Any(s => s.Name == server.Name))
            {
                _logger.Error("The name of the server must be unique.");
                throw new Exception(Error.ServerNameMustBeUnique.ToString());
            }

            if (jars.All(j => j.Id != server.JarFile))
            {
                _logger.Error("That jar file does not exist.");
                throw new Exception(Error.JarFileDoesNotExist.ToString());
            }

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
                {
                    _logger.Info($"Added new server: {createdServer.Name}");
                    return createdServer;
                }

                await _serverRepository.Remove(createdServer.Id);
                _logger.Error($"An error occured whilst adding a new Server. Contact creator of SpigotWrapper!");
                throw new Exception("ERROR: CONTACT CREATOR OF SpigotWrapper!");
            }
            catch (Exception exception)
            {
                await _serverRepository.Remove(createdServer.Id);
                _logger.Error(exception);
                throw new Exception("ERROR: There was no JavaExecutable setting found in the database.");
            }
        }

        public async Task<Server> Get(Guid id, bool enrichEnabledPlugins)
        {
            var server = await ServerExists(id);
            if (enrichEnabledPlugins)
                await EnrichWithEnabledPlugins(server);
            return server;
        }

        public async Task Remove(Guid id)
        {
            var server = await ServerExists(id);
            var serverPath = Path.Combine(ServerPath, server.Id.ToString());

            var deleted = ServerManager.Instance.DeleteServer(id);
            if (!deleted)
            {
                _logger.Error("A server with that id cannot be found.");
                throw new Exception("A server with that id cannot be found.");
            }

            await _serverRepository.Remove(id);
            Directory.Delete(serverPath, true);
            _logger.Info($"Removed server: {server.Name}");
        }

        public async Task<bool> AddPlugin(Guid id, Guid pluginId)
        {
            var server = await ServerExists(id);
            var plugin = await _pluginRepository.Get(pluginId);
            if (plugin == null)
            {
                _logger.Error("A plugin with that id cannot be found.");
                throw new Exception("A plugin with that id cannot be found.");
            }

            if ((await _pluginServerRepository.AllByServerId(id)).FirstOrDefault(record => record.PluginId == pluginId) != null)
                return false;

            var pluginServer = new PluginServer
            {
                PluginId = plugin.Id,
                ServerId = server.Id
            };
            var repositoryResult = await _pluginServerRepository.Add(pluginServer);
            var wrapperResult = ServerManager.AddPlugin(id, _mapper.Map<Plugin>(plugin));

            if (!wrapperResult)
                await _pluginServerRepository.Remove(repositoryResult.Id);
            return wrapperResult;
        }
        
        public async Task<bool> RemovePlugin(Guid id, Guid pluginId)
        {
            var pluginServer = (await _pluginServerRepository.AllByServerId(id)).FirstOrDefault(record => record.PluginId == pluginId);

            if (pluginServer == null)
                return false;

            await _pluginServerRepository.Remove(pluginServer.Id);
            return ServerManager.RemovePlugin(id, pluginId);
        }

        public async Task<Server> EnablePlugins(Guid id, bool enablePlugins)
        {
            var server = await ServerExists(id);
            server.EnablePlugins = enablePlugins;
            
            ServerManager.EnablePlugins(id, enablePlugins);
            return await _serverRepository.Update(server);
        }

        public async Task<IEnumerable<RamUsage>> GetRamUsage(Guid id, int count = 100)
            => await _ramUsageRepository.Get(id, count);

        public async Task<IEnumerable<CpuUsage>> GetCpuUsage(Guid id, int count = 100)
            => await _cpuUsageRepository.Get(id, count);

        private async Task<Server> ServerExists(Guid id)
        {
            var server = await _serverRepository.Get(id);
            if (server != null) return server;
            
            _logger.Error("A server with that id cannot be found.");
            throw new Exception("A server with that id cannot be found.");
        }

        private async Task EnrichWithEnabledPlugins(Server server)
            => await EnrichWithEnabledPlugins(server, _pluginRepository, _pluginServerRepository);
        private static async Task EnrichWithEnabledPlugins(Server server, IPluginRepository pluginRepository,
            IPluginServerRepository pluginServerRepository)
        {
            if (server != null)
            {
                var pluginsServer = await pluginServerRepository.AllByServerId(server.Id);
                var plugins = new List<PluginModel>();
                foreach (var pluginServer in pluginsServer)
                    plugins.Add(await pluginRepository.Get(pluginServer.PluginId));
                server.EnabledPlugins = plugins.Count > 0 ? plugins.ToArray() : Array.Empty<PluginModel>();
            }
        }
        #endregion
    }
}
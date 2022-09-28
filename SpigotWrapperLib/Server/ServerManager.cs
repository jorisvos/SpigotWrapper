using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;

namespace SpigotWrapperLib.Server
{
    public class ServerManager
    {
        private readonly List<Wrapper> _wrappers;
        public static ServerManager Instance { get; private set; }

        public ServerManager(List<Wrapper> wrappers)
        {
            _wrappers = wrappers;
            Instance = this;
        }

        public bool CreateServer(Wrapper wrapper)
        {
            if (Directory.Exists(wrapper.ServerPath))
                return false;

            Directory.CreateDirectory(wrapper.ServerPath);
            
            _wrappers.Add(wrapper);
            return true;
        }

        public bool AcceptEula(Guid id)
        {
            var wrapper = _wrappers.FirstOrDefault(s => s.Id == id);
            if (wrapper == null)
                return false;
            
            var eulaPath = Path.Combine(wrapper.ServerPath, "eula.txt");

            if (!File.Exists(eulaPath))
                return false;

            var eulaContents = File.ReadAllLines(eulaPath);
            var index = eulaContents.ToList().IndexOf("eula=false");
            if (index < 0)
                return false;
            
            eulaContents[index] = "eula=true";
            File.WriteAllLines(eulaPath, eulaContents);
            return true;
        }

        public bool DeleteServer(Guid id)
        {
            var wrapper = _wrappers.FirstOrDefault(s => s.Id == id);
            if (wrapper == null)
                return false;
            
            StopServer(id);
            WaitForStop(id);
            
            _wrappers.Remove(wrapper);
            return true;
        }

        public string[] GetPlugins(Guid id)
        {
            var plugins = _wrappers.FirstOrDefault(server => server.Id == id)?.PluginManager?.Plugins;
            return plugins is not {Count: > 0} 
                ? null 
                : plugins!.Select(plugin => plugin.Name).ToArray();
        }
        
        public void WaitForStop(Guid id)
        {
            while (IsRunning(id))
            {
                Thread.Sleep(10);
            }
        }

        public List<Wrapper> GetAllInfo(int count = -1)
            => _wrappers.GetRange(0, count == -1 || count > _wrappers.Count ? _wrappers.Count : count);
        public Wrapper GetInfo(Guid id)
            => _wrappers.FirstOrDefault(s => s.Id == id);
        public bool StartServer(Guid id)
            => _wrappers.FirstOrDefault(server => server.Id == id)?.Start() ?? false;
        public bool StopServer(Guid id)
            => _wrappers.FirstOrDefault(server => server.Id == id)?.Stop(null, null) ?? false;
        public bool KillServer(Guid id)
            => _wrappers.FirstOrDefault(server => server.Id == id)?.Kill() ?? false;
        public void StopAll()
            => _wrappers.ForEach(server => server.Stop(null, null));
        public void KillAll()
            => _wrappers.ForEach(server => server.Kill());
        public bool ExecuteCommand(Guid id, string command)
            => _wrappers.FirstOrDefault(server => server.Id == id)?.WriteLine(command) ?? false;
        public string LatestMinecraftLog(Guid id)
            => _wrappers.FirstOrDefault(server => server.Id == id)?.LatestMinecraftLog;
        public string LatestLog(Guid id)
            => _wrappers.FirstOrDefault(server => server.Id == id)?.LatestLog;
        public bool IsRunning(Guid id)
            => _wrappers.FirstOrDefault(server => server.Id == id)?.IsRunning ?? false;
        public void WaitForAllToStop()
            => _wrappers.ForEach(server => WaitForStop(server.Id));
    }
}
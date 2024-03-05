using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Runtime.Loader;
using SpigotWrapperLib.Server;

namespace SpigotWrapperLib.Plugin
{
    public class PluginManager
    {
        public List<ISpigotWrapperPlugin> Plugins { get; } = new();
        public static readonly string PluginPath = Path.Combine(Main.RootPath, "plugins");

        private readonly Wrapper _wrapper;
        private AssemblyLoadContext _pluginLoadContext;
        
        public PluginManager(Wrapper wrapper, string[] enabledPlugins)
        {
            _wrapper = wrapper;
            
            _pluginLoadContext = new AssemblyLoadContext(PluginPath, true);
            _pluginLoadContext.Resolving += AssemblyResolve;

            var pluginFiles = Directory.GetFiles(PluginPath, "*.dll");
            if (pluginFiles.Length > 0)
            {
                Log("Loading plugins...");
                foreach (var file in pluginFiles)
                {
                    if (!enabledPlugins.Contains(Path.GetFileNameWithoutExtension(file)))
                        continue;
                    Log($"Loading plugin: {Path.GetFileName(file)}");
                    LoadPlugin(file);
                }
                Log("Finished loading plugins!");
            }
            else
                Log("No plugins found!");
            Log($"{Plugins.Count} plugins loaded");
        }

        public void UnloadPlugins()
        {
            foreach (var plugin in Plugins)
                plugin.UnloadPlugin();
            Plugins.Clear();
            _pluginLoadContext.Unload();
            _pluginLoadContext = null;
        }

        private void LoadPlugin(string file)
        {
            try
            {
                var assembly = _pluginLoadContext.LoadFromAssemblyPath(file);
                foreach (var type in assembly.GetTypes())
                {
                    if (!typeof(ISpigotWrapperPlugin).IsAssignableFrom(type))
                        continue;
                    var plugin = Activator.CreateInstance(type, _wrapper) as ISpigotWrapperPlugin;
                    Plugins.Add(plugin);
                }
            }
            catch (Exception e)
            {
                Log(
                    $"\n/!\\ Could not load Plugin: {Path.GetFileName(file)}\n{e.GetType()}\nFile: {file}\nError: {e.Message}\nStacktrace: {e.StackTrace}\n");
                if(e.InnerException != null)
                    Log(
                        $"InnerException: {e.InnerException.GetType()}\nMessage: {e.InnerException.Message}\nStacktrace: {e.InnerException.StackTrace}\n");
            }
        }

        private void Log(string msg)
            => _wrapper.Log($"[PluginManager] {msg}");

        private Assembly AssemblyResolve(AssemblyLoadContext context, AssemblyName assemblyName)
            => File.Exists(Path.Combine(PluginPath, $"libs/{assemblyName.Name}.dll")) 
                ? _pluginLoadContext.LoadFromAssemblyPath(Path.Combine(PluginPath, $"libs/{assemblyName.Name}.dll")) 
                : null;
    }
}
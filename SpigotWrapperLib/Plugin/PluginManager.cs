using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using SpigotWrapperLib.Server;

namespace SpigotWrapperLib.Plugin
{
    public class PluginManager
    {
        public List<ISpigotWrapperPlugin> Plugins { get; }
        public static readonly string PluginPath = Path.Combine(Main.RootPath, "plugins");

        private readonly Wrapper _wrapper;
        
        public PluginManager(Wrapper wrapper, string[] enabledPlugins)
        {
            _wrapper = wrapper;
            Plugins = new List<ISpigotWrapperPlugin>();

            AppDomain.CurrentDomain.AssemblyResolve += AssemblyResolve;

            var pluginFiles = Directory.GetFiles(PluginPath, "*.dll");
            if (pluginFiles.Length > 0)
            {
                _wrapper.Log("Loading plugins...\n");
                foreach (var file in pluginFiles)
                {
                    if (!enabledPlugins.Contains(Path.GetFileNameWithoutExtension(file)))
                        continue;
                    _wrapper.Log($"Loading plugin: {Path.GetFileName(file)}");
                    LoadPlugins(file);
                }
                _wrapper.Log("", true, false);
                _wrapper.Log("Finished loading plugins!");
            }
            else
                _wrapper.Log("No plugins found!");
            _wrapper.Log($"{Plugins.Count} plugins loaded\n");
        }

        public void UnloadPlugin(string name) 
            => Plugins.Remove(Plugins.First(plugin => plugin.Name == name));

        private void LoadPlugins(string file)
        {
            try
            {
                var assembly = Assembly.LoadFrom(file);
                foreach (var type in assembly.GetTypes())
                {
                    if (!typeof(ISpigotWrapperPlugin).IsAssignableFrom(type))
                        continue;
                    
                    var plugin = (ISpigotWrapperPlugin) Activator.CreateInstance(type, _wrapper);
                    Plugins.Add(plugin);
                }
            }
            catch (Exception e)
            {
                _wrapper.Log(
                    $"\n/!\\ Could not load Plugin: {Path.GetFileName(file)}\n{e.GetType()}\nError: {e.Message}\nStacktrace: {e.StackTrace}\n");
                if(e.InnerException != null)
                    _wrapper.Log(
                        $"InnerException: {e.InnerException.GetType()}\nMessage: {e.InnerException.Message}\nStacktrace: {e.InnerException.StackTrace}\n");
            }
        }

        private static Assembly AssemblyResolve(object sender, ResolveEventArgs e) 
            => File.Exists(Path.Combine(PluginPath, "libs/" + new AssemblyName(e.Name!).Name + ".dll")) ? Assembly.LoadFile(Path.Combine(PluginPath, "libs/" + new AssemblyName(e.Name!).Name + ".dll")) : null;
    }
}
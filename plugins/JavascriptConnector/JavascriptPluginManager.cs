using SpigotWrapperLib.Server;

namespace JavascriptConnector;

internal class JavascriptPluginManager
{
  private readonly JavascriptPlugin[] _plugins;
  private readonly Wrapper _wrapper;
  private string PluginsPath => Path.Combine(_wrapper.SpigotWrapperPath, "JavascriptConnectorPlugins");

  internal JavascriptPluginManager(Wrapper wrapper)
  {
    _wrapper = wrapper;
    _plugins = Array.Empty<JavascriptPlugin>();

    Directory.CreateDirectory(PluginsPath);
    var pluginFiles = Directory.GetFiles(PluginsPath, "*.js");
    if (pluginFiles.Length > 0)
    {
      var plugins = new List<JavascriptPlugin>();
      Log("Loading javascript plugins...");
      foreach (var pluginFile in pluginFiles)
      {
        Log("Loading plugin: "+pluginFile);
        var source = File.ReadAllText(pluginFile);
        var name = Path.GetFileNameWithoutExtension(pluginFile);
        var plugin = new JavascriptPlugin(name, source, _wrapper);
        plugins.Add(plugin);
      }
      _plugins = plugins.ToArray();
      Log("Finished loading javascript plugins.");
    }
    else
      Log("No javascript plugins found!");
    Log(_plugins.Length+" javascript plugins loaded.");
  }

  internal void UnloadPlugins()
  {
    foreach (var plugin in _plugins)
      plugin.UnloadPlugin();
  }

  internal void TriggerEvent(string name, params object[] arguments)
  {
    foreach (var plugin in _plugins)
    {
      plugin.Invoke(name, arguments);
    }
  }

  private void Log(string msg)
    => _wrapper.Log("[JavascriptConnector] "+msg);
}

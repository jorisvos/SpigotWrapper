using Jint;
using SpigotWrapperLib.Server;

namespace JavascriptConnector;

internal class JavascriptPlugin
{
  private Engine JsEngine { get; }

  internal JavascriptPlugin(string name, string source, Wrapper wrapper)
  {
    JsEngine = new Engine();
    JsEngine.SetValue("Console", new API.Console(name, wrapper));
    JsEngine.SetValue("Config", new SpigotWrapperLib.API.Config(wrapper.ConfigPath));
    JsEngine.SetValue("Player", new SpigotWrapperLib.API.Player(wrapper.Id));
    JsEngine.SetValue("Server", new SpigotWrapperLib.API.Server(wrapper.Id));

    JsEngine.Execute(source);
  }

  internal void UnloadPlugin()
    => JsEngine.Dispose();

  internal void Invoke(string functionName, params object?[] arguments)
  {
    if (JsEngine.GetValue(functionName).ToString() != "undefined")
      JsEngine.Invoke(functionName, arguments);
  }
}

using SpigotWrapperLib.Events;
using SpigotWrapperLib.Plugin;
using SpigotWrapperLib.Server;

namespace JavascriptConnector;

public class JavascriptConnector :ISpigotWrapperPlugin
{
  public string Name => "JavascriptConnector";
  private readonly Wrapper _wrapper;
  private readonly JavascriptPluginManager _pluginManager;

  public JavascriptConnector(Wrapper wrapper)
  {
    _wrapper = wrapper;
    _pluginManager = new JavascriptPluginManager(wrapper);
    
    _wrapper.MinecraftConnector.PlayerJoin += PlayerJoin;
    _wrapper.MinecraftConnector.PlayerLeft += PlayerLeft;
    _wrapper.MinecraftConnector.PlayerChatReceived += PlayerChatReceived;
    _wrapper.MinecraftConnector.PlayerPositionReceived += PlayerPositionReceived;

    _wrapper.MinecraftConnector.ServerStart += ServerStart;
    _wrapper.MinecraftConnector.ServerStarted += ServerStarted;
    _wrapper.MinecraftConnector.ServerStop += ServerStop;
    _wrapper.MinecraftConnector.ServerStopped += ServerStopped;
  }

  public void UnloadPlugin()
  {
    _wrapper.MinecraftConnector.PlayerJoin -= PlayerJoin;
    _wrapper.MinecraftConnector.PlayerLeft -= PlayerLeft;
    _wrapper.MinecraftConnector.PlayerChatReceived -= PlayerChatReceived;
    _wrapper.MinecraftConnector.PlayerPositionReceived -= PlayerPositionReceived;

    _wrapper.MinecraftConnector.ServerStart -= ServerStart;
    _wrapper.MinecraftConnector.ServerStarted -= ServerStarted;
    _wrapper.MinecraftConnector.ServerStop -= ServerStop;
    _wrapper.MinecraftConnector.ServerStopped -= ServerStopped;
    
    _pluginManager.UnloadPlugins();
  }

  private void PlayerJoin(object? sender, PlayerJoinedEventArgs e)
    => _pluginManager.TriggerEvent("PlayerJoin", e.Player);
  private void PlayerLeft(object? sender, PlayerLeftEventArgs e)
    => _pluginManager.TriggerEvent("PlayerLeft", e.Player);
  private void PlayerChatReceived(object? sender, PlayerChatEventArgs e)
    => _pluginManager.TriggerEvent("ChatReceived", e.Player, e.Message);
  private void PlayerPositionReceived(object? sender, PlayerPositionEventArgs e)
    => _pluginManager.TriggerEvent("PlayerPosition", e.Player, e.X, e.Y, e.Z);

  private void ServerStart(object? sender, ServerEventArgs e)
    => _pluginManager.TriggerEvent("ServerStart");
  private void ServerStarted(object? sender, ServerEventArgs e)
    => _pluginManager.TriggerEvent("ServerStarted");
  private void ServerStop(object? sender, ServerEventArgs e)
    => _pluginManager.TriggerEvent("ServerStop");
  private void ServerStopped(object? sender, ServerEventArgs e)
    => _pluginManager.TriggerEvent("ServerStopped");
}
using SpigotWrapperLib.Server;

namespace JavascriptConnector.API;

public class Console
{
  private readonly Wrapper _wrapper;
  private readonly string _pluginName;

  public Console(string pluginName, Wrapper wrapper)
  {
    _wrapper = wrapper;
    _pluginName = pluginName;
  }
  
  private string _tmpMsg = "";
  public void Write(string msg)
    => _tmpMsg += msg;
  public void WriteLine(string msg)
  {
    _wrapper.Log($"[JavascriptConnector/{_pluginName}] "+_tmpMsg+msg);
    _tmpMsg="";
  }

  public void Beep()
    => System.Console.Beep();
}

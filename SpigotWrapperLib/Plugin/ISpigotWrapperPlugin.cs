namespace SpigotWrapperLib.Plugin
{
    public interface ISpigotWrapperPlugin
    {
        string Name { get; }
        void UnloadPlugin();
    }
}
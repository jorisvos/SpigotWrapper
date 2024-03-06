namespace SpigotWrapper.Config
{
    public enum JarKind
    {
        Vanilla = 0,
        Bukkit = 1,
        Spigot = 2,
        Paper = 3,
        Forge = 4
    }

    public enum Error
    {
        JarAlreadyDownloaded = 0,
        JarFilenameMustBeUnique = 1,
        JarKindAndVersionMustBeUniqueTogether = 2,
        ServerNameMustBeUnique = 3,
        JarFileDoesNotExist = 4,
        PluginDoesNotExist = 5,
    }
}
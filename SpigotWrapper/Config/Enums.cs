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
        JarAlreadyDownloaded,
        JarFilenameMustBeUnique,
        JarKindAndVersionMustBeUniqueTogether,
        ServerNameMustBeUnique,
        JarFileDoesNotExist,
        PluginDoesNotExist,
        PluginInUse,
        JarDoesNotExist,
        JarInUse,
    }
}
using System;
using System.IO;
using SpigotWrapperLib.Log;
using SpigotWrapperLib.Plugin;

namespace SpigotWrapperLib
{
    public static class Main
    {
        public static string RootPath => Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), "SpigotWrapper");

        public static void Initialize()
        {
            CreateDirectories();
            Backup.BackupLogs();
        }
        
        private static void CreateDirectories()
        {
            Directory.CreateDirectory(RootPath);
            Directory.CreateDirectory(Logger.LogPath);
            Directory.CreateDirectory(PluginManager.PluginPath);
        }
    }
}
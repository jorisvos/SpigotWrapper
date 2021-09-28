using System;
using System.IO;
using SpigotWrapperLib.Log;
using SpigotWrapperLib.Plugin;

namespace SpigotWrapperLib
{
    public class Main
    {
        public static string RootPath => Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), "SpigotWrapper");

        public static void Initialize()
        {
            CreateDirectories();
            Backup.BackupLogs();
        }
        
        public static void CreateDirectories()
        {
            Directory.CreateDirectory(RootPath);
            Directory.CreateDirectory(Logger.LogPath);
            Directory.CreateDirectory(PluginManager.PluginPath);
        }
    }
}
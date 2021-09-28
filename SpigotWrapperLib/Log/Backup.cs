using System;
using System.IO;

namespace SpigotWrapperLib.Log
{
    public class Backup
    {
        private static bool _backedUpLogs;
        
        public static void BackupLogs()
        {
            Directory.CreateDirectory(Logger.LogPath);
            if (!File.Exists(Logger.LatestLog))
            {
                _backedUpLogs = true;
                File.Create(Logger.LatestLog).Close();
            }

            if (_backedUpLogs)
                return;
            
            var date = DateTime.Now.ToString("yyyy-MM-dd");
            for (var i = 0;; i++)
            {
                if (File.Exists(Path.Combine(Logger.LogPath, $"{date}({i}).log")))
                    continue;
                File.Move(Logger.LatestLog, Path.Combine(Logger.LogPath, $"{date}({i}).log"));
                break;
            }
            _backedUpLogs = true;
            File.Create(Logger.LatestLog).Close();
        }
    }
}
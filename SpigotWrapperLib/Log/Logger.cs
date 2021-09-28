using System.IO;

namespace SpigotWrapperLib.Log
{
    public class Logger
    {
        public static string LogPath => Path.Combine(Main.RootPath, "logs");
        public static string LatestLog => Path.Combine(LogPath, "latest.log");

        public static void Log(object line) => File.AppendAllLines(LatestLog, new[] {line.ToString()});
    }
}
using System;
using System.IO;

namespace SpigotWrapperLib.Log
{
    public class Logger
    {
        public static string LogPath => Path.Combine(Main.RootPath, "logs");
        public static string LatestLog => Path.Combine(LogPath, "latest.log");

        public static void Log(object line) => File.AppendAllLines(LatestLog, new[] {line.ToString()});
        public static void Debug(object className, object line) => Log($"[{DateTime.Now}] [{className}/DEBUG]: {line}");
        public static void Info(object className, object line) => Log($"[{DateTime.Now}] [{className}/INFO]: {line}");
        public static void Warn(object className, object line) => Log($"[{DateTime.Now}] [{className}/WARN]: {line}");
        public static void Error(object className, object line) => Log($"[{DateTime.Now}] [{className}/ERROR]: {line}");
        public static void Fatal(object className, object line) => Log($"[{DateTime.Now}] [{className}/FATAL]: {line}");

        private string _className;
        public Logger(string className)
        {
            _className = className;
        }

        public void Debug(object line) => Debug(_className, line);
        public void Info(object line) => Info(_className, line);
        public void Warn(object line) => Warn(_className, line);
        public void Error(object line) => Error(_className, line);
        public void Fatal(object line) => Fatal(_className, line);
    }
}
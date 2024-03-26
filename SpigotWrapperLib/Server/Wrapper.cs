using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading;
using SpigotWrapperLib.Log;
using SpigotWrapperLib.Plugin;

namespace SpigotWrapperLib.Server
{
    public class Wrapper
    {
        #region Database Properties
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string JarFile { get; set; }
        public string JavaArguments { get; set; }
        public bool EnablePlugins { get; set; }
        public Plugin.Plugin[] EnabledPlugins { get; set; }
        public DateTime? CreatedAt { get; set; } 
        public DateTime? ModifiedAt { get; set; }
        #endregion
        
        #region Properties
        [JsonIgnore]
        public string ServerPath { get; set; }
        [JsonIgnore]
        public string JavaExecutable { get; set; }
        public bool IsRunning => _server is { HasExited: false };
        [JsonIgnore]
        public string SpigotWrapperPath => Path.Combine(ServerPath, "SpigotWrapper");
        [JsonIgnore]
        public string ConfigPath => Path.Combine(SpigotWrapperPath, "configs");
        [JsonIgnore]
        public string LogPath => Path.Combine(SpigotWrapperPath, "logs");
        [JsonIgnore]
        public string LatestLog => Path.Combine(LogPath, "latest.log");
        [JsonIgnore]
        public string MinecraftLogPath => Path.Combine(ServerPath, "logs");
        [JsonIgnore]
        public string LatestMinecraftLog => Path.Combine(MinecraftLogPath, "latest.log");
        [JsonIgnore]
        public string ServerProperties => Path.Combine(ServerPath, "server.properties");
        [JsonIgnore]
        public string JarFilePath { get; set; }
        #endregion
        
        #region Variables
        private Process _server;
        private DateTime _lastTime;
        private TimeSpan _lastTotalProcessorTime;
        private bool _backedUpLogs;
        
        public event EventHandler<DataReceivedEventArgs> OutputReceived;
        public PluginManager PluginManager;
        public readonly MinecraftConnector MinecraftConnector;
        #endregion

        public Wrapper()
            => MinecraftConnector = new MinecraftConnector(this);

        #region _server
        public bool Start()
        {
            if (_server is {HasExited: false})
                return false;
            
            BackupLogs();

            if (JarFile == null)
                return false;
            
            _server = new Process
            {
                StartInfo = new ProcessStartInfo
                {
                    FileName = JavaExecutable,
                    Arguments = JavaArguments.Replace("%jar%", "\"" + JarFilePath + "\""),
                    WorkingDirectory = ServerPath,
                    UseShellExecute = false,
                    RedirectStandardOutput = true,
                    RedirectStandardInput = true,
                    RedirectStandardError = true,
                    CreateNoWindow = true
                },
                EnableRaisingEvents = true
            };
            
            _server.OutputDataReceived += ReadMessage;
            _server.ErrorDataReceived += ReadMessage;
            _server.ErrorDataReceived += (_, args) => { if (args.Data != null) Log(args.Data); };
            _server.Exited += (_, _) => Log("Server Stopped!", addServerWrapperPrefix: true);
            _server.Exited += MinecraftConnector.TriggerServerStopped;

            Log($"Starting server with arguments: {_server.StartInfo.Arguments}", addServerWrapperPrefix: true);
            if (EnablePlugins && EnabledPlugins.Length > 0)
            {
                PluginManager = new PluginManager(this, EnabledPlugins.Select(plugins => plugins.Name).ToArray());
                _server.Exited += (_, _) => PluginManager.UnloadPlugins();
            }

            _server.Start();
            _lastTime = DateTime.Now;
            _lastTotalProcessorTime = _server.TotalProcessorTime;
            
            _server.BeginOutputReadLine();
            _server.BeginErrorReadLine();
            return true;
        }

        public List<(DateTime, long, double)> _ramCpuUsage = new();
        public (long, double) GetRamAndCpuUsage()
        {
            if (_server == null || _server.HasExited)
                return (0,0);
            _server.Refresh();
            
            var ramUsageMb = _server.WorkingSet64;
            var curTime = DateTime.Now;
            var curTotalProcessorTime = _server.TotalProcessorTime;
            var cpuUsage = (curTotalProcessorTime.TotalMilliseconds - _lastTotalProcessorTime.TotalMilliseconds) 
                / curTime.Subtract(_lastTime).TotalMilliseconds 
                / Convert.ToDouble(Environment.ProcessorCount) * 100;

            _lastTime = curTime;
            _lastTotalProcessorTime = curTotalProcessorTime;

            _ramCpuUsage.Add((DateTime.Now, ramUsageMb, cpuUsage));
            return (ramUsageMb, cpuUsage);
        }
        
        public bool Stop(object sender, EventArgs e)
        {
            if (_server is null or {HasExited: true})
                return false;
            WriteLine("stop");
            return true;
        }

        public bool Kill()
        {
            if (_server is null or {HasExited: true})
                return false;
            _server.Kill();
            return true;
        }
        
        private void ReadMessage(object sender, DataReceivedEventArgs e)
        {
            if (e?.Data == null)
                return;
            OutputReceived?.Invoke(this, e);
        }
        
        public bool WriteLine(string line)
        {
            if (_server is not {HasExited: false})
                return false;
            _server.StandardInput.WriteLine(line);
            Log($"Command: {line}", addServerWrapperPrefix: true);
            return true;
        }

        public void ChangeEnablePlugins(bool enablePlugins)
            => EnablePlugins = enablePlugins;
        #endregion

        #region Utils
        public void Log(string line, bool addToFile = true, bool addTime = true, bool addServerWrapperPrefix = false)
        {
            if (addServerWrapperPrefix)
                line = $"[ServerWrapper] {line}";
            
            if (addTime)
                line = $"[{DateTime.Now:T}] {line}";
            if (!addToFile)
                return;
            
            // Append to SpigotWrapper log
            File.AppendAllLines(LatestLog, new[] {line});
            // Append to Global SpigotWrapper log
            Logger.Log($"Server ({Name}): {line}");
        }
        
        private void BackupLogs()
        {
            Directory.CreateDirectory(LogPath);
            if (!File.Exists(LatestLog))
            {
                _backedUpLogs = true;
                File.Create(LatestLog).Close();
            }
            if (_backedUpLogs)
                return;
            
            var date = DateTime.Now.ToString("yyyy-MM-dd");
            for (var i = 0;; i++)
            {
                if (File.Exists(Path.Combine(LogPath, $"{date}({i}).log")))
                    continue;
                File.Move(LatestLog, Path.Combine(LogPath, $"{date}({i}).log"));
                break;
            }
            _backedUpLogs = true;
            File.Create(LatestLog).Close();
        }
        #endregion
    }
}
using System;
using System.Diagnostics;
using SpigotWrapperLib.Events;
using SpigotWrapperLib.Log;

namespace SpigotWrapperLib.Server
{
    public class MinecraftConnector
    {
        public MinecraftConnector(Wrapper wrapper)
            => wrapper.OutputReceived += ReadServerOutput;

        private void ReadServerOutput(object sender, DataReceivedEventArgs e)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(e.Data) || e.Data.Length < 12 || !e.Data.Contains(":"))
                    return;

                var info = e.Data[11..];
                var message = info[(info.IndexOf(":", StringComparison.Ordinal) + 2)..].Trim();

                if (message.Contains("<") && message.Contains(">"))
                {
                    var split = message.Split(new[] { '<', '>' }, StringSplitOptions.RemoveEmptyEntries);
                    var name = split[0];
                    var chat = string.Join(' ', split[1..]).Trim();

                    var eventArgs = new PlayerChatEventArgs(name, chat);
                    TriggerEvent(PlayerChatReceived, eventArgs);
                }

                else if (message.StartsWith("Starting minecraft server "))
                    TriggerEvent(ServerStart, new ServerEventArgs());
                else if (message.StartsWith("Done (") && message.EndsWith("s)! For help, type \"help\""))
                    TriggerEvent(ServerStarted, new ServerEventArgs());
                else if (message.Equals("Stopping server"))
                    TriggerEvent(ServerStop, new ServerEventArgs());

                else if (message.Contains("joined the game"))
                {
                    var name = message.Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries)[0];
                    var eventArgs = new PlayerJoinedEventArgs(name);

                    TriggerEvent(PlayerJoin, eventArgs);
                }
                else if (message.Contains("left the game"))
                {
                    var name = message.Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries)[0];
                    var eventArgs = new PlayerLeftEventArgs(name);

                    TriggerEvent(PlayerLeft, eventArgs);
                }
                else if (message.Contains("Teleported"))
                {
                    //TODO: handle following Minecraft server output: Teleported <playername> to <playername>
                    if (!message.Contains(":"))
                        return;
                    
                    var toSplit = !message.StartsWith("Teleported")
                        ? message[(message.IndexOf(":", StringComparison.Ordinal) + 2)..^1]
                        : message;
                    var split = toSplit.Split(new[] { ' ', ',' }, StringSplitOptions.RemoveEmptyEntries);
                    var name = split[1];

                    var x = int.Parse(split[^3].Split('.')[0]);
                    var y = int.Parse(split[^2].Split('.')[0]);
                    var z = int.Parse(split[^1].Split('.')[0]) - 1;

                    var eventArgs = new PlayerPositionEventArgs(name, x, y, z);
                    TriggerEvent(PlayerPositionReceived, eventArgs);
                }
            }
            catch (ArgumentOutOfRangeException exception)
            {
                Logger.Error("MinecraftConnector", exception);
            }
        }

        public void TriggerServerStopped(object sender, EventArgs e)
            => TriggerEvent(ServerStopped, new ServerEventArgs());
        
        private void TriggerEvent<T>(EventHandler<T> eventHandler, T args) where T : EventArgs
            => eventHandler?.Invoke(this, args);

        public event EventHandler<PlayerJoinedEventArgs> PlayerJoin;
        public event EventHandler<PlayerLeftEventArgs> PlayerLeft;
        public event EventHandler<PlayerChatEventArgs> PlayerChatReceived;
        public event EventHandler<PlayerPositionEventArgs> PlayerPositionReceived;

        public event EventHandler<ServerEventArgs> ServerStart;
        public event EventHandler<ServerEventArgs> ServerStarted;
        public event EventHandler<ServerEventArgs> ServerStop;
        public event EventHandler<ServerEventArgs> ServerStopped;
    }
}
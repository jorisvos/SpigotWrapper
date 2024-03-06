// PlayerJoin(name) is invoked when a player joins the server, the name variable contains the name of the player that joined the server.
function PlayerJoin(name) {
    Console.WriteLine('Player \''+name+'\' joined.');
    Player.SendMessageTo(name, 'Welcome to this server!', 'gold');
}

// PlayerLeave(name) is invoked when a player leaves the server, the name variable contains the name of the player that left the server.
function PlayerLeft(name) {
    Console.WriteLine('Player \''+name+'\' left.');
    Console.Beep();
}

// ChatReceived(name, message) is invoked when a player types something in chat
// name contains the name of the player that send the message
// message contains the message send by the player
function ChatReceived(name, message) {
    if (message.toUpperCase() === message && message.length > 3)
        Server.RunCommand('kick '+name+' Please don\'t shout!');
    
    else if (message.toLowerCase() === '.light')
        Server.RunCommand('execute at '+name+' run setblock ~ ~ ~ minecraft:torch');
    
    else if (message.toLowerCase().split(' ')[0] === '.tpme')
        Server.RunCommand('tp '+message.split(' ')[1]+' '+name);
}

// PlayerPosition(name, x, y, z) is invoked when a player is teleported
// name contains the name of the player that is teleported, the x y and z variables contain the respective coordinates
function PlayerPosition(name, x, y, z) {
    Server.RunCommand('setblock '+x+' '+y+' '+z+' minecraft:torch');
}

// ServerStart is invoked when the server is starting
function ServerStart() {
    Console.WriteLine('Example plugin active! Commands: .tpme <player> and .light');
}

// ServerStarted is invoked when the server is done with starting
function ServerStarted() {
    Console.WriteLine('This plugin has a anti-caps lock function.');
}

// ServerStop is invoked when the server is stopping
function ServerStop() {
    Console.Beep();
}

// ServerStopped is invoked when the server is shutdown
function ServerStopped() {
    Console.Beep();
}
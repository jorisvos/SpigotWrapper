let welcomeMessage;
let welcomeColor;
let allowedCapsPercentage;

// ServerStart is invoked when the server is starting
function ServerStart() {
    LoadConfig();
}

// ServerStarted is invoked when the server is done with starting
function ServerStarted() {
    Console.WriteLine('Advanced example plugin active! Commands: .welcome <welcome messgae>, .welcome_color <color>, .welcome_refresh');
}

function LoadConfig() {
    // Config.GetConfig(configName) returns a string containing the contents of the config file (configs are saved as .json files)
    const config = JSON.parse(Config.GetConfig('advancedJavascript'));
    
    welcomeMessage = config.welcomeMessage || 'Welcome to this server %player%.';
    welcomeColor = config.welcomeColor || 'red';
    allowedCapsPercentage = config.allowedCapsPercentage || 40;
    
    SaveConfig();
}

function SaveConfig() {
    const config = {
        welcomeMessage,
        welcomeColor,
        allowedCapsPercentage,
    };
    
    // Config.SaveConfig(configName, configObject) saves the config object as a .json file under the specified configName
    Config.SaveConfig('advancedJavascript', config);
}

// PlayerJoin(name) is invoked when a player joins the server, the name variable contains the name of the player that joined the server.
function PlayerJoin(name) {
    Player.SendMessageTo(name, welcomeMessage.replace('%player%', name), welcomeColor);
}

// ChatReceived(name, message) is invoked when a player types something in chat
// name contains the name of the player that send the message
// message contains the message send by the player
function ChatReceived(name, message) {
    const args = message.split(' ');
    
    if (args[0].toLowerCase() === '.welcome' && args.length > 1) {
        welcomeMessage = args.slice(1).join(' ');
        SaveConfig();
        Player.SendMessageTo(name, 'Welcome message set!', 'dark_blue');
    } else if (args[0].toLowerCase() === '.welcome_color' && args.length === 2) {
        welcomeColor = args[1];
        SaveConfig();
        Player.SendMessageTo(name, 'Welcome message color set!', args[1]);
    } else if (args[0].toLowerCase() === '.welcome_refresh') 
        LoadConfig();
    else {
        let upperCaseCount = 0;
        for (let i = 0; i < message.length; i++) {
            const currentLetter = message.substring(i, i+1);
            if (currentLetter === currentLetter.toUpperCase() && currentLetter.toLowerCase() !== currentLetter.toUpperCase())
                upperCaseCount++;
        }
        if (message.length > 5 && upperCaseCount/message.length*100 > allowedCapsPercentage)
            Server.RunCommand('kick '+name+' A maximum of '+allowedCapsPercentage+'% upper case letters is allowed, you had '+upperCaseCount/message.length*100+'%');
    }
}
const Discord = require("discord.js");
const config = require("./config.json");
const messages = require("./messages.json");

const client = new Discord.Client();

var prefix = config.prefix;

var mercList = [];
var maxSlots = 50;
var freeSlots = maxSlots;
var countMercs = 0;
var remain = 0;
var eventKhanDate = config.eventKhanDate; // setEventDate(Date.now);

// -- EVENTOS --
// -------------
client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on("message", async (message) => {
    // This event will run on every single message received, from any channel or DM.
  
    // It's good practice to ignore other bots. This also makes your bot ignore itself
    // and not get into a spam loop (we call that "botception").
    if(message.author.bot) return;
    
    // Also good practice to ignore any message that does not start with our prefix, 
    // which is set in the configuration file.
    // if(message.content.indexOf(config.prefix) !== 0) return;
        
    // CRUD ----------------
    // ---------------------
    // AÑADIR 
    if (freeSlots > 0 ) {
        if (!message.author.bot) {
            if (message.content.startsWith(eventKhanDate)) {

                //añadir usuario a la lista
                var existMerc = false;
                var mensajeDelUsuario = message.content;
                for(var i=0; i<mercList.length; i++) {
                    // si el nuevo mensaje existe en la lista, mostrará un mensaje avisandolo y saldra
                    console.log(`${mensajeDelUsuario.intent === (mercList[i].intent)} - ${message.content} - ${mercList[i]}`);
                    
                    if(mensajeDelUsuario.intent === mercList[i].intent) {
                        //message.reply(`Ya estas apuntado en el roster`);
                        console.log(`el usuario existe ${message.content} - ${mercList[i]} - ${i}` );
                        message.author.send(messages.playerListed);
                        message.delete();
                        existMerc = true;
                        i = mercList.length;
                    };
                }
                if (!existMerc) {
                    countMercs = mercList.push(message);
                }

                // Eliminar Todos los mensajes
                const msgToBulk = await message.channel.messages.fetch({ limit: 10});
                message.channel.bulkDelete(msgToBulk)
                    .then(console.log("borrado"))
                    .catch(error => message.reply(`No puedo borrar mensages porque: ${error.stack}`));
                
                // Muestra la lista de mercenarios
                var columnA = '-', columnB = '-', columnC = '-';
                for(var i=0; i<mercList.length; i++) {
                    if (i<20) {
                        if(i===0) columnA = "";
                        columnA = columnA.concat("`").concat(mercList[i]).concat("`\r");
                    } else if (i<40) {
                        if(i===20) columnB = "";
                        columnB = columnB.concat("`").concat(mercList[i]).concat("`\r");
                    } else {
                        if(i===40) columnC = "";
                        columnC = columnC.concat("`").concat(mercList[i]).concat("`\r");
                    }
                } 
                
                freeSlots = maxSlots - mercList.length

                // Mostrar los paneles 
                // -------------------
                // Muestra los participantes del evento
                // --------------------------------
                const Roster = new Discord.MessageEmbed()
                    //.setTitle("titulo")
                    //.setDescription("descripcion")
                    .setColor('#0099ff')
                    .addField("Platoon A", `${columnA}`, true)
                    .addField("Platoon B", `${columnB}`, true)
                    .addField("Platoon C", `${columnC}`, true);
                message.channel.send(Roster);

                // Muestra el estado de los slots
                // --------------------------------
                const statusRoster = new Discord.MessageEmbed()
                    .setTitle('Status Roster')
                    .setColor('#0099ff')
                    .addField('Max Slots:', `${maxSlots}`, true)
                    .addField('Free Slots:', `${freeSlots}`, true)
                    .addField('Mercs:', `${countMercs}`, true);
                message.channel.send(statusRoster);

                // Descripcion de la Guild
                // --------------------------------
                var descripcion = [
                    "`Summoning around 20:00 CET.` (leave desert/margoria before CTG)\n\r"+
                    "`Mercenary invites STARTS around 18:00 CET`\r"+
                    "`Mercenary invites FINISH around 19:30 CET`\n\r"+
                    "__*Need as many mercs as possible.*__\n\r"+
                    "`Join our discord and write khan/25/03[FamilyName] in our #khan-chat, so we know who wants to join.`\r"
                ];
                const guildDescription = new Discord.MessageEmbed()
                    .setTitle('__**BALEARICUS doing Khan Wednesday 25th**__')
                    .setColor('#0099ff')
                    .addField("-", `${descripcion}`, false);
                message.channel.send(guildDescription);

                // bloquea el canal para que nadie escriba 
                if (freeSlots <= 0) {
                    message.channel.lockPermissions();
                }

            } else {
                // Cualquier mensaje que no sea un codigo lo borra
                message.delete();
            }
        }

    } else {
        message.delete();
        // muestra el mensaje de que estamos completos
        message.author.send(messages.rosterComplete);
    }

    // ELIMINAR
    if (message.content.startsWith(prefix + "limpiar" )) {
        message.reply("Deberia borrar todo.");
    }
});

client.login(config.token);
require('dotenv').config()

const { throws } = require('assert')
const Discord = require('discord.js')
const Bot = new Discord.Client()
const prefix = "-"
const fs = require('fs')
const mongoose = require('mongoose')
const mysql = require('mysql')
const workRecently=new Set()
const dailyRecently=new Set()
const token=process.env.DISCORD_TOKEN;
const CLASSES=/(a|b)/i

Bot.commands = new Discord.Collection(); // Initialize the Bot's Command

const commandFiles = fs.readdirSync('./Commands/').filter(file => file.endsWith('.js')); // Read the command folder to get the command data

for(const file of commandFiles){
    const command = require(`./Commands/${file}`);

    Bot.commands.set(command.name, command);
}

Bot.once('ready', () => {
    console.log('The Bot is up and running!');
    console.log(`Prefix: ${prefix}`);
});

Bot.on('message', message => {
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    // Create a connection to mysql
    const conn=mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "ngosong_bot"
    })

    const table = {
        currency: "currency",
        tugas: "tugas",
    }

    // SQL Functions
    const dataNotFound = (res) => res.length <= 0 ? true : false;

    // Discord variables
    const args = message.content.slice(prefix.length).split(/ + /);
    const command = args.shift().toLowerCase();
    const comm = command.split(" ");
    const user = message.author.toString();

    // Functions
    const sendReply = (text) => message.reply(text)
    const sendMessage = (text) => message.channel.send(text) // Sends message to the Discord
    const isMentioning = require('./functions/isMentioning')
    const getJSONFile = require('./functions/getJsonFile')
    const capitalizeFirstLetter = require('./functions/capitalizeFirstLetter')
    const deleteMessage = (msg,time) => setTimeout(() => msg.delete(), time) // Deleting the command message
    const hasEmptyData = (data) => {
        let empty=false
        for(let d of Object.values(data)) {
            empty = (d === undefined)
            if(empty) break
        }
        return empty
    }

    // ==================== GENERAL COMMANDS =======================
    if(command==='help') {
        Bot.commands.get('help').execute(message,Discord)
    }

    if(command==='ping') {
        Bot.commands.get('ping').execute(message)
    }

    if(command==='hadir') {
        Bot.commands.get('absen').execute(message,user)
    }

    if(command==="colek") {
        Bot.commands.get('colek').execute(message,user)
    }

    if(comm[0] === "tobat") {
        Bot.commands.get('tobat').execute(message,user,comm[1])
    }

    if(comm[0] === "santet") {
        Bot.commands.get('santet').execute(message,comm[1])
    }

    // ================ KULIAH COMMANDS ======================
    
    if(command==='link') {
        Bot.commands.get('link_penting').execute(message,Discord)
    }

    if(comm[0] === 'jadwal') {
        // Add jadwal command: ${prefix}jadwal tambah ${matkul} ${hari} ${jam} ${kelas} ${semester}

        switch(comm[1]) {
            case 'tambah':
                const newData={
                    matkul: capitalizeFirstLetter(comm[2]),
                    hari: capitalizeFirstLetter(comm[3]),
                    jam: comm[4],
                    kelas: capitalizeFirstLetter(comm[5]),
                    semester: comm[6]
                }
                if(hasEmptyData(newData)) {
                    message.channel.send("Format command salah!")
                    message.channel.send(`\`\`\`Command: ${prefix}jadwal tambah matkul hari jam kelas semester\nContoh: ${prefix}jadwal tambah Alprog Senin 08.30-10.30 a 1\`\`\` `)
                } else {
                    Bot.commands.get('add_jadwal').execute(message,newData)
                }
                break;

            case 'list':
                if(CLASSES.test(comm[2])) {
                    const kelas=capitalizeFirstLetter(comm[2])
                    Bot.commands.get('list_jadwal').execute(message,kelas)
                } else {
                    message.reply("kelas yang mana ngab?")
                }
                break;

            default: 
                message.channel.send('Ada kesalahan dalam melakukan command')
                break;
        }
    }
    
    if(comm[0] === "tugas") {
        // Add tugas command:  ${prefix}tugas tambah ${judul} ${matkul} ${deadline} ${kelas}

        if(comm[1]==="tambah") {
            const data={
                judul: comm[2],
                matkul: comm[3],
                deadline: comm[4],
                kelas: comm[5]
            }
            
            if(hasEmptyData(data)) {
                message.channel.send('Format tambah tugas salah!')
                message.channel.send(`Command: ${prefix}tugas tambah {judul} {matkul} {deadline} {kelas}`)
            } else {
                Bot.commands.get('add_tugas').execute(message,data)
            }
        }

        if(comm[1]==="list") {
            Bot.commands.get('list_tugas').execute(message)
        }
    }

    // =========================== GAME COMMANDS ===================================

    if(comm[0] === "tebak") {
        if(comm[1] === "angka") {
            Bot.commands.get('tebak_angka').execute(message,comm[2])
        }

        if(comm[1] === "hewan") {
            Bot.commands.get('tebak_hewan').execute(message,comm[2])
        }
    }

    if(comm[0] == "tag") {
        Bot.commands.get('tag').execute(message,user,comm[1],comm[2])
    }

    if(comm[0] === "tod") {
        const prompt = getJSONFile("./data/prompt.json");
        const group = getJSONFile("./data/members.json");

        const allIsAsked = object => {
            let temp = 0;
            object.map(obj => { temp += (obj.sudah) ? 1 : 0; })
            return temp === object.length;
        }

        const resetPrompts = object => {
            object.map(obj => { obj.sudah = false; })
        }

        if(comm[1] === "truth") {
            let pick = { desc: "", sudah: false }
            let index = 0;
            do {
                index = Math.floor(Math.random() * prompt.truth.length)
                pick = prompt.truth[index];
            }while(pick.sudah);

            prompt.truth[index].sudah = true;
            sendMessage(`Pertanyaannya adalah:\n${pick.desc}`);
            if(allIsAsked(prompt.truth)) { resetPrompts(prompt.truth) }
        }

        if(comm[1] === "dare") {
            let pick = { desc: "", sudah: false }
            let index = 0;
            do {
                index = Math.floor(Math.random() * prompt.dare.length)
                pick = prompt.dare[index]
            }while(pick.sudah)

            prompt.dare[index].sudah = true;
            sendMessage(`Perintah anda adalah:\n${pick.desc}`);
            if(allIsAsked(prompt.dare)) { resetPrompts(prompt.dare) }
        }

        if(comm[1] === "person") {
            let pick = { name: "", sudah: false }
            let index = 0;
            do {
                index = Math.floor(Math.random() * group.members.length)
                pick = group.members[index]
            }while(pick.sudah);

            group.members[index].sudah = true;
            sendMessage(`Selamat kepada ${pick.name}, TRUTH OR DARE`)
            if(allIsAsked(group.members)) { resetPrompts(group.members) }
        }

        if(comm[1] === "reset") {
            resetPrompts(prompt.truth)
            resetPrompts(prompt.dare)
            resetPrompts(group.members)
            sendMessage("Semua pertanyaan telah direset");
        }

        if(comm[1] === "help" || comm[1] === undefined) {
            sendMessage(`Untuk bermain, caranya berikut:\n
            1. Pilih terlebih dahulu pemainnya dengan ".tod person"\n
            2. Silahkan pilih Truth or Dare dengan cara ".tod truth" atau ".tod dare"\n
            3. Laksanakanlah perintah/pertanyaan dengan baik\n
            4. Ini adalah bagian dalam permainan. Silahkan ulang kembali ke langkah pertama.\n
            `)
        }
    }

    if(comm[0] === "suit") {
        if(comm[1] === undefined || comm[1] === null) {
            message.channel.send(`Cara suit: Tulis ${prefix}suit gunting/batu/kertas`)
        } else {
            Bot.commands.get('suit').execute(message,comm[1])
        }
    }

    // ================= WORK COMMANDS ====================

    if(comm[0] === "tabungan") {
        if(comm[1] === undefined || comm[1] === null || !isMentioning(comm[1])) {
            Bot.commands.get('tabungan').execute(message,user)
        } else {
            Bot.commands.get('tabungan').execute(message,comm[1])
        }
    }

    if(command === "kerja") {
        Bot.commands.get('kerja').execute(message,user,workRecently)
    }

    if(comm[0] === "minta") {
        Bot.commands.get('beg').execute(message,user,comm[1])
    }

    if(comm[0] === "kasih") {
        Bot.commands.get('give_money').execute(message,user,comm[1],comm[2])
    }

    if(command === "daily") {

    }
});

mongoose.connect(process.env.MONGODB_SRV, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(() => {
    console.log('Connected to the database!')
}).catch(err => {
    console.log(err)
})

Bot.login(token);
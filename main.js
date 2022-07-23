require('dotenv').config()

const { throws } = require('assert')
const Discord = require('discord.js')
const Bot = new Discord.Client()
const prefix = "-"
const fs = require('fs')
const mysql = require('mysql')
const workRecently=new Set()
const dailyRecently=new Set()
const token=process.env.TOKEN;

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
        tugas: "daftar_tugas",
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
    const isMentioning = (mention) => mention.startsWith('<@!') && mention.endsWith('>') // Check if sender is mentioning a member
    const getJSONFile = (file) => JSON.parse(fs.readFileSync(file).toString()) // Read the JSON files
    const deleteMessage = (msg,time) => setTimeout(() => msg.delete(), time) // Deleting the command message

    // Commands
    if(command==='help') {
        Bot.commands.get('help').execute(message,Discord)
    }

    if(command==='ping') {
        Bot.commands.get('ping').execute(message)
    }

    if(command==='link') {
        Bot.commands.get('link_penting').execute(message,Discord)
    }

    if(command==='hadir') {
        Bot.commands.get('absen').execute(message,user)
    }

    if(command==="colek") {
        Bot.commands.get('colek').execute(message,user)
    }

    if(comm[0] === 'jadwal') {
        if(comm[1] === "a" || comm[1] === "A" || comm[1] === "kelas_a") {
            Bot.commands.get('jadwal_kelas_a').execute(message, args, Discord, conn)
        } else if(comm[1] === "b" || comm[1] === "B" || comm[1] === "kelas_b") {
            Bot.commands.get('jadwal_kelas_b').execute(message, args, Discord, conn)
        } else {
            // Bot.commands.get('jadwal_kelas_a').execute(message, args, Discord, conn)
            // Bot.commands.get('jadwal_kelas_b').execute(message, args, Discord, conn)
        }
    }

    if(comm[0] === "tebak") {
        if(comm[1] === "angka") {
            Bot.commands.get('tebak_angka').execute(message,comm[2])
        }

        if(comm[1] === "hewan") {
            Bot.commands.get('tebak_hewan').execute(message,comm[2])
        }
    }

    if(comm[0] === "santet") {
        Bot.commands.get('santet').execute(message,comm[1])
    }

    if(comm[0] == "tag") {
        if(comm[1] == null) return;
        deleteMessage(message, 300)
        if(isMentioning(comm[1])) {
            const loops = parseInt(comm[2])
            if(loops > 10) {
                sendMessage("Wahai kalian... Berhentilah mengganggu orang lain")
            } else {
                for(let i=0; i<loops; i++ ) {
                    setTimeout(() => sendMessage(comm[1]), 100);
                }
            }
        } else {
            sendMessage(`Siapa yang mau dispam ngab ${user}?`);
        }
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
        const convertToNumber = (text) => {

            // Gunting = 0
            // Batu = 1
            // Kertas = 2

            const ans = text.toLowerCase();
            switch(ans) {
                case 'gunting': return 0;
                case 'batu': return 1;
                case "kertas": return 2;
                default: return -1;
            }
        }

        const setWin = (a,b) => {
            if(a === b) {
                return -1;
            }

            if(
                (a === 0 && b === 2)
                ||
                (a === 1 && b === 0)
                ||
                (a === 2 && b === 1)
            ) {
                return 1; // Jika menang
            }
            return 0; // Jika kalah
        }

        if(comm[1] === undefined) {
            sendMessage(`Cara suit: Tulis ${prefix}suit gunting/batu/kertas`);
            return;
        }
        const player = convertToNumber(comm[1]);
        const enemy = Math.floor(Math.random() * 3);
        const win = setWin(player, enemy);

        setTimeout(() => {
            sendMessage(`Aing lawan pake ${
                (enemy === 1 ? "Batu" : (enemy === 2) ? "Kertas" : "Gunting")
            }`)
        }, 300)
        
        switch(win) {
            case -1: sendMessage("Okeh good game kita seri")
                break;
            case 0: sendMessage("HEHEHEE ANDA KALAH")
                break;
            case 1: sendMessage("Haduhhhh aing kalah")
                break;
        }
    }

    if(comm[0] === "tobat") {
        Bot.commands.get('tobat').execute(message,user,comm[1])
        // const taggedUser=comm[1]
        // deleteMessage(message, 300)
        // sendMessage(`Bertobatlah nak ${taggedUser}`)
    }

    if(comm[0] === "tabungan") {
        conn.connect(err => {
            if(err) throw err;

            if(comm[1] === undefined) {
                const query=`SELECT * FROM ${table.currency} WHERE discord_id='${user}'`;

                conn.query(query, (err, res, fields) => {
                    if(err) throw err;
                    if(dataNotFound(res)) {
                        sendMessage(`${user} belum membuka tabungan`)
                    } else {
                        const bal=res[0].balance
                        sendMessage(`Jumlah tabungan ${user} adalah Rp${bal}`)
                    }
                })
            } else {
                const accountId=comm[1]
                if(isMentioning(accountId)) {
                    const query=`SELECT * FROM ${table.currency} WHERE discord_id='${accountId.replace("!","")}'`
                    conn.query(query, (err,res,fields) => {
                        if(err) throw err;
                        if(dataNotFound(res)) {
                            sendMessage(`${accountId} belum membuka tabungan`)
                        } else {
                            const bal=res[0].balance
                            sendMessage(`Jumlah tabungan ${accountId} adalah Rp${bal}`)
                        }    
                    })
                } else {
                    sendMessage("Format tagnya salah kawand")
                }
            }
        })
    }

    if(comm[0] === "minta") {
        deleteMessage(message, 300)

        if(comm[1] === undefined) {
            sendMessage(`Help dong gais, ${user} butuh duit nih @everyone`)
        } else {
            const beg=comm[1]

            if(isMentioning(beg)) {
                sendMessage(`Halo ${beg}, ${user} minta duit dari mu :)`)
            } else {
                sendMessage(`Minta sama siapa kawan? ${user}`)
            }
        }
    }

    if(comm[0] === "kasih") {
        deleteMessage(message, 300)

        const begger=comm[1]
        const amount=comm[2]

        if(isMentioning(begger)) {
            conn.connect(err => {
                if(err) throw err;

                const query=`SELECT * FROM ${table.currency} WHERE discord_id='${user}';`

                conn.query(query, (err,res,fields) => {
                    if(err) throw err;

                    const account={
                        id: res[0].discord_id,
                        balance: res[0].balance
                    }

                    account.balance -= amount

                    if(account.balance < 0) {
                        sendMessage("Maaf saldo anda tidak cukup :(")
                        return
                    } else {
                        const getBeggerData=`SELECT * FROM ${table.currency} WHERE discord_id='';`
                        
                        // const updateGiverQuery=`UPDATE ${table.currency} SET balance='${account.balance}' WHERE discord_id='${account.id}';` // Update the giver's balance
                        // conn.query(updateGiverQuery, (err,res) => {
                        //     if(err) throw err;
                        // })

                        // const updateBeggerQuery=`UPDATE ${table.currency} SET balance='${amount}' WHERE discord_id='${begger.replace("!","")}';` // Update the begger's balance
                        // conn.query(updateBeggerQuery, (err,res) => {
                        //     if(err) throw err;
                        // })

                        sendMessage(`Yey, ${user} baru saja donasikan duit sebesar ${amount} ke ${begger}`)
                    }
                })
            })
        } else {
            sendMessage("Mau ngirim ke siapa ngab?");
        }
    }

    if(command === "daily") {

        const cooldown=1000 * 60 * 60 * 24
        // const currDate=new Date()

        const dailyObject={
            userDc:user,
            date: new Date()
        }

        if(dailyRecently.has(dailyObject.userDc)) {
            sendReply("Sudah mengambil daily reward hari ini")
        } else {
            conn.connect(err => {
                if(err) throw err;
    
                const minReward=200
                const maxReward=600
        
                const dailyReward=Math.floor(Math.random()*maxReward)+minReward
        
                const query=`SELECT * FROM ${table.currency} WHERE discord_id=${user}`    
    
                conn.query(query, (err, res, fields) => {
                    if(err) throw err;
    
                    if(dataNotFound(res)) {
                        const insertQuery=`INSERT INTO ${table.currency} VALUES ('${user}','${payment}');`
                        conn.query(insertQuery, (err, res) => {
                            if(err) throw err;
                        })
                    } else {
                        let bal=res[0].balance
                        bal += dailyReward
        
                        const updateQuery=`UPDATE ${table.currency} 
                                        SET balance='${bal}' 
                                        WHERE discord_id='${user}';`
        
                        conn.query(updateQuery, (err, res) => {
                            if(err) throw err;    
                        })
                    }
                    sendMessage(`${user} telah mengambil daily reward sebesar Rp${dailyReward}`)
                })
            })

            dailyRecently.add(dailyObject.userDc)
            setTimeout(() => {
                dailyRecently.delete(dailyObject.userDc)
            }, cooldown)
        }
    }

    if(command === "kerja") {
        deleteMessage(message,300)

        const cooldown=60 // In minutes

        if(workRecently.has(user)) {
            sendReply(`Anda sudah ambil duit kurang dari sejam yang lalu`)
        } else {
            conn.connect(err => {
                if(err) throw err;
                
                const minPayment=100
                const maxPayment=500

                const payment=Math.floor(Math.random()*maxPayment)+minPayment

                const query=`SELECT * FROM ${table.currency} WHERE discord_id='${user}';`

                conn.query(query, (err, res, fields) => {
                    if(err) throw err;

                    if(dataNotFound(res)) {
                        const insertQuery=`INSERT INTO ${table.currency} VALUES ('${user}','${payment}');`
                        conn.query(insertQuery, (err, res) => {
                            if(err) throw err;
                        })

                    } else {
                        let bal=res[0].balance
                        bal += payment
        
                        const updateQuery=`UPDATE ${table.currency} 
                                        SET balance='${bal}' 
                                        WHERE discord_id='${user}';`
        
                        conn.query(updateQuery, (err, res) => {
                            if(err) throw err;    
                        })
                    }

                    sendMessage(`${user} memperoleh uang sebesar Rp${payment}`)                    
                })
            })

            workRecently.add(user)
            setTimeout(() => {
                workRecently.delete(user)
            }, cooldown * 1000 * 60);
        }
    }

    if(comm[0] === "tugas") {
        // Functions for tugas
        const wrongDateFormat = (day,month,year) => (
            (day < 0 || day > 31)
            ||
            (month < 0 || month > 12)
            ||
            (year < 0 || year > 9999)
        )
        
        conn.connect(err => {
            if(err) throw err;
            
            if(comm[1] === "tambah") {
                const date=comm[4]
                const dateArray=date.split("-")
                const tugas={
                    judul: comm[2],
                    matkul: comm[3],
                    deadline: {
                        year: dateArray[0],
                        month: dateArray[1],
                        day: dateArray[2]
                    }
                }

                // Add a validation function for each of the atributes
                console.log(wrongDateFormat(tugas.deadline.day, tugas.deadline.month, tugas.deadline.year))

                // const query=`INSERT INTO ${table.tugas} VALUES ('${tugas.judul}','${tugas.matkul}','${tugas.deadline}')`

                // conn.query(query, (err,res) => {
                //     if(err) throw err;
                // })
            }

            if(comm[1] === "list") {
                const query=`SELECT * FROM ${table.tugas}`
                conn.query(query, (err,res,fields) => {
                    if(err) throw err;

                    res.foreach(rs => {
                        // Print respond
                        sendMessage(`Judul: ${rs.nama_tugas}\nMata Kuliah: ${rs.matkul}\nDeadline: ${rs.deadline}`)
                    })
                })
            }

            if(comm[1] === "search") {
                if(comm[2] === "judul") {
                    const judul=comm[3]
                    const query=`SELECT * FROM ${table.tugas} WHERE judul='${judul}';`
                    conn.query(query, (err,res,fields) => {
                        if(err) throw err;

                        res.foreach(rs => {
                            // Print respond
                            sendMessage(`Judul: ${rs.nama_tugas}\nMata Kuliah: ${rs.matkul}\nDeadline: ${rs.deadline}`)
                        })
                    })
                }
                if(comm[2] === "matkul") {
                    const matkul=comm[3]
                    const query=`SELECT * FROM ${table.tugas} WHERE matkul='${matkul}';`
                    conn.query(query, (err,res,fields) => {
                        if(err) throw err;

                        res.foreach(rs => {
                            // Print respond
                            sendMessage(`Judul: ${rs.nama_tugas}\nMata Kuliah: ${rs.matkul}\nDeadline: ${rs.deadline}`)
                        })
                    })
                }
            }
        })
    }
});

Bot.login(token); // Change each time
module.exports={
    name: 'colek',
    desc: 'Tease the bot',
    execute(message,user) {
        const text=[
            "Apaan", `Bacot maneh ${user}`, "Sia ngajak ribut bae", "Jangan ganggu cok",
            "Lapangan kosong, ayo gelud", "Ajak ribut yang lain aelah"
        ]
        const messageText=text[Math.floor(Math.random()*text.length)]
        message.reply(messageText)
    }
}
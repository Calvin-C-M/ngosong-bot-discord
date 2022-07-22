module.exports={
    name: 'tebak_angka',
    desc: "Guessing a number game",
    execute(message,guess="") {
        const number=Math.floor((Math.random()*1000)+1)
        if(guess==number.toString()) {
            message.channel.send(`Yapp betul, angkanya adalah ${number}`)
        } else {
            message.channel.send(`TETOT, anda salah HAHAHA. Angkanya adalah ${number}`)
        }
    }
}
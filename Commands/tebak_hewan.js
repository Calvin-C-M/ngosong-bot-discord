module.exports={
    name: "tebak_hewan",
    desc: "Guessing animal game",
    execute(message,guess="") {
        const getJsonFile=require("../functions/getJsonFile.js")
        const hewanList=getJsonFile("./data/tebak.json").hewan
        const answer=hewanList[Math.floor(Math.random()*hewanList.length)]
        if(guess===answer) {
            message.channel.send(`Mantap hoki sekali hidup anda, jawabannya ${answer}`)
        } else {
            message.channel.send(`HEHEHHEHE ANDA SALAH SILAHKAN COBA LAGI. Tadi jawabannya ${answer}`)
        }
    }
}
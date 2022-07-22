module.exports={
    name: "santet",
    desc: "Do witchcraft to a certain target",
    execute(message, target) {
        if(target===null) return
        
        const getJsonFile=require('../functions/getJsonFile.js')
        const success=Math.floor(Math.random()*2)

        if(success) {
            const craftList=getJsonFile('./data/santet.json').berhasil
            const craft=craftList[Math.floor(Math.random()*craftList.length)]
            message.channel.send(`${target} berhasil disantet! ${target} ${craft}`)
        } else {
            const craftList=getJsonFile('./data/santet.json').gagal
            const craft=craftList[Math.floor(Math.random()*craftList.length)]
            message.channel.send(`${target} gagal disantet! ${target} ${craft}`)
        }
    }
}
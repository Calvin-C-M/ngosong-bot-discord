module.exports={
    name: "tobat",
    desc: "Tobat for a target",
    execute(message,user,target) {
        const isMentioning=require('../functions/isMentioning')
        setTimeout(() => message.delete(), 500)

        if(target===null || !isMentioning(target)) {
            message.channel.send(`Kayaknya anda yang perlu tobat ${user}`)
        } else {
            message.channel.send(`Tobatlah nak ${target}`)
        }
    }
}
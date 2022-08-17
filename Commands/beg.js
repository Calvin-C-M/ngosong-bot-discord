module.exports={
    name: "beg",
    desc: "Beg money to other users",
    execute(message,user,target) {
        const isMentioning=require('../functions/isMentioning')
        setTimeout(() => message.delete(),300)

        if(target===undefined || target===null) {
            message.channel.send(`Help dong gais, ${user} butuh duit nih @everyone`)
        } else {
            if(isMentioning(target)) {
                message.channel.send(`Oi ${target}, ${user} minta duit dari lu :)`)
            } else {
                message.reply(`Minta tolong sama siapa ngab?`)
            }
        }
    }
}
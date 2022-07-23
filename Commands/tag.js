module.exports={
    name: "tag",
    desc: "Annoy someone by tagging them",
    execute(message,sender,target,total_loop) {
        const isMentioning=require('../functions/isMentioning')
        setTimeout(() => message.delete(),500)

        if(target===undefined || !isMentioning(target) || target===null) {
            message.channel.send(`Siapa yang mau ditag ngab? ${sender}`)
        } else {
            const MAX_LOOP=10
            total_loop=(total_loop===null || total_loop===undefined) ? 1 : total_loop
            
            if(total_loop <= MAX_LOOP) {
                for(let i=0; i<total_loop; i++) {
                    setTimeout(() => message.channel.send(target), 100)
                }
            } else {
                message.reply('jangan ganggu berlebihan lahh')
            }
        }
    }
}
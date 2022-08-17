const currencyModel=require("../models/currencyModel")

module.exports={
    name: "tabungan",
    desc: "Get currency information",
    async execute(message,target) {
        setTimeout(() => message.delete(),300)
        await currencyModel.findOne({ discord_id: target })
            .then(data => {
                if(data) {
                    message.channel.send(`${target} memiliki tabungan ${data.balance}`)
                } else {
                    message.channel.send(`${target} belum punya tabungan`)
                }
            })
            .catch(err => {
                console.log(err)
                message.channel.send('(!) Mohon maaf ada kesalahan, silahkan kontak maintainer')
            })
    }
}
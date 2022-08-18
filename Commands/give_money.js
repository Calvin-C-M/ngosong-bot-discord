const currencyModel=require("../models/currencyModel")
const isMentioning=require('../functions/isMentioning')

module.exports={
    name: "give_money",
    description: "Gives money to a specific user",
    async execute(message,user,target,amount) {
        if(target === undefined || target === null || !isMentioning(target)) {
            message.reply('siapa yang mau dikasih ngab?')
        } else if(amount == 0) {
            message.reply('kasian amat dikasihnya 0')
        } else {
            await currencyModel.findOne({ discord_id: user })
                .then(data => {
                    if(data) {
                        const userBalance=data.balance-parseInt(amount)
                        if(userBalance < 0) {
                            message.reply('Duitnya kurang ngab')
                        } else {
                            currencyModel.updateOne({ discord_id: user }, { balance: userBalance })
                            .then(async () => {
                                await currencyModel.findOne({ discord_id: target })
                                    .then(data => {
                                        if(data) {
                                            const targetBalance=data.balance+parseInt(amount)
                                            currencyModel.updateOne({ discord_id: target }, { balance: targetBalance })
                                            .then(() => {
                                                setTimeout(() => message.delete(),300)
                                                message.channel.send(`${user} mengirim ${target} uang sejumlah NR${amount}`)
                                            })
                                            .catch(err => {
                                                console.log(err)
                                                message.channel.send("(!) Ada kesalahan pada database, silahkan kontak maintainer")
                                            })
                                        } else {
                                            message.channel.send(`${target} belum memiliki akun`)
                                        }
                                    })
                                    .catch(err => {
                                        console.log(err)
                                        message.channel.send("(!) Ada kesalahan pada database, silahkan kontak maintainer")
                                    })
                            })
                            .catch(err => {
                                console.log(err)
                                message.channel.send("(!) Ada kesalahan pada database, silahkan kontak maintainer")
                            })
                        }
                    } else {
                        message.reply('anda belum memiliki akun')
                    }
                })
                .catch(err => {
                    console.log(err)
                    message.channel.send("(!) Ada kesalahan pada database, silahkan kontak maintainer")
                })
        }
    }
}
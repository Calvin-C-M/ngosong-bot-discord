const currencyModel=require('../models/currencyModel')

const EARLY_WAGE=1000
const MAX_WAGE=500

const saveShiftSet = (shift_set,user) => {
    const COOLDOWN=60 // In minutes
    shift_set.add(user)
    setTimeout(() => shift_set.delete(user), COOLDOWN*1000*60)
}

module.exports={
    name: "kerja",
    description: "Doing work for 1 hour",
    async execute(message,user,shift_set) {
        if(shift_set.has(user)) {
            message.reply('lu udah kerja ngab')
        } else {
            await currencyModel.findOne({ discord_id: user })
                .then(data => {
                    if(data) {
                        const wage=Math.round(Math.random()*MAX_WAGE)
                        const newBalance=data.balance+wage
                        currencyModel.updateOne({ discord_id: user},{ balance: newBalance })
                        .then(() => {
                            message.reply(`anda mendapatkan gaji sebesar ${wage}`)
                            saveShiftSet(shift_set,user)
                        })
                        .catch(err => {
                            console.log(err)
                            message.channel.send("(!) Ada kesalahan pada database, silahkan kontak maintainer")
                        })
                    } else {
                        currencyModel.create({
                            discord_id: user,
                            balance: EARLY_WAGE
                        }).then(() => {
                            message.reply(`karena anda baru mulai kerja, gaji awal lu adalah ${EARLY_WAGE}`)
                            saveShiftSet(shift_set,user)
                        }).catch(err => {
                            console.log(err)
                            message.channel.send('(!) Ada kesalahan pada database, silahkan kontak maintainer')
                        })
                    }
                })
                .catch(err => {
                    console.log(err)
                    message.channel.send('(!) Ada kesalahan pada database, silahkan kontak maintainer')
                })
        }
    }
}
const currencyModel=require("../models/currencyModel")

const reward={
    MIN: 300,
    MAX: 1000,
}

const EARLY_WAGE=1000

const resetTime={
    hour: 7,
    minute: 0,
    seconds: 0,
    mseconds: 0,
}

module.exports={
    name: "daily",
    description: "Same as working but can only do once per day",
    async execute(message,user,daily_set) {
        const present=new Date()
        const now={
            hour: present.getHours(),
            minute: present.getMinutes(),
            seconds: present.getSeconds(),
            mseconds: present.getMilliseconds()
        }

        const MINUTE_TIMER=Math.abs(((resetTime.minute == 0 ? 60 : resetTime.minute))-now.minute)
        const HOUR_TIMER=(24+resetTime.hour) - now.hour - ((MINUTE_TIMER > 0) ? 1 : 0)
        const COOLDOWN=(HOUR_TIMER*24*60*1000)+(MINUTE_TIMER*1000*60)

        if(daily_set.has(user)) {
            message.reply(`lu udah ngambil daily hari ini! Lu bisa ngambil lagi dalem waktu ${HOUR_TIMER} jam dan ${MINUTE_TIMER} menit lagi`)
        } else {
            await currencyModel.findOne({ discord_id: user })
                .then(data => {
                    if(data) {
                        const wage=Math.floor(Math.random()*reward.MAX)+reward.MIN
                        const newBalance=data.balance+wage
                        currencyModel.updateOne({ discord_id: user }, { balance: newBalance })
                        .then(() => {
                            message.channel.send(`${user} melakukan daily dan mendapatkan duit sejumlah ${wage}`)
                            daily_set.add(user)

                            setTimeout(() => {
                                daily_set.delete(user)
                            },COOLDOWN)
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
                            message.reply(`anda belum punya tabungan, jadi nih modal awal ${EARLY_WAGE}`)
                        }).catch(err => {
                            console.log(err)
                            message.channel.send("(!) Ada kesalahan pada database, silahkan kontak maintainer")
                        })
                    }
                })
                .catch(err => {
                    console.log(err)
                    message.channel.send("(!) Ada kesalahan pada database, silahkan kontak maintainer")
                })
        }
    }
}
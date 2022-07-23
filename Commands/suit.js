module.exports={
    name: "suit",
    desc: "A game of rock, paper, scissors",
    execute(message,playerPicks) {
        const picksList=[ "batu", "kertas", "gunting" ]

        const setWin = (player,bot) => {
            if(player===bot) return -1 // if it is a tie
            else if( // if player wins
                (player === picksList[0] && bot === picksList[1])
                ||
                (player === picksList[1] && bot === picksList[2])
                ||
                (player === picksList[2] && bot === picksList[0])
            ) return 1
            return 0 // if bot wins
        }

        if(picksList.includes(playerPicks)) {
            const botPicks=picksList[Math.floor(Math.random()*picksList.length)]
            const win=setWin(playerPicks,botPicks)

            setTimeout(() => {
                switch(win) {
                    case -1: message.channel.send('Okeh, good game kita seri')
                        break
                    case 0: message.channel.send('HEHEHE, anda kalah')
                        break
                    case 1: message.channel.send('Haduhhh aing kalah')
                        break
                }    
            }, 300)
            message.channel.send(`Aing lawan pake ${botPicks}`)
        } else {
            message.channel.send(`Pilihlah diantara ${picksList}`)
        }
    }
}
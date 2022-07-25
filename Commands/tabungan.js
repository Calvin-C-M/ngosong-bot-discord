module.exports={
    name: "tabungan",
    desc: "Get currency information",
    execute(message,target,connection,tables) {
        connection.connect(err => {
            if(err) throw err
            const query=`SELECT * FROM currency WHERE discord_id=${target}`

            connection.query(query, (err,res,field) => {
                if(err) throw err

                // If data cannot be found
                if(res.length <= 0) {
                    message.channel.send(`${target} belum membuat akun`)
                } else {
                    const balance=res[0].balance
                    message.channel.send(`Jumlah tabungan ${target} adalah ${balance}`)
                }
            })
        })
    }
}
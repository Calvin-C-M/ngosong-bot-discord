module.exports={
    name: "list_tugas",
    desc: "Give list of tugas from database",
    execute(message,connection,Discord) {
        const today={
            day: new Date().getDay(),
            month: new Date().getMonth(),
            year: new Date().getFullYear(),
            toString() {
                return `${this.year}-${this.month}-${this.day}`
            }
        }

        const query=`SELECT * FROM tugas WHERE deadline > '${today.toString()}'`
        connection.query(query, (err,res,fields) => {
            if(err) throw err

            const listTugas=new Discord.MessageEmbed()
            .setColor("#304281")
            .setTitle("Daftar Tugas")

            res.filter(data => {
                listTugas.addFields({ 
                    name: `${data.judul}`,
                    value: `${data.matkul} - ${data.deadline.toString().substring(0,15)} - ${data.kelas}`
                })
            })

            message.channel.send(listTugas)
        })
    }
}
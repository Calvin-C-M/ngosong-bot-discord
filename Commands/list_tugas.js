const tugasModel=require('../models/tugasModel')
const Discord=require('discord.js')

const listTugas=new Discord.MessageEmbed()
.setColor("#304281")
.setTitle("Daftar Tugas")

module.exports={
    name: "list_tugas",
    desc: "Give list of tugas from database",
    async execute(message) {
        const today=new Date()
        const tugasData = await tugasModel.find({ deadline: { $gte: today } })
                        .then(tugasData => {
                            tugasData.filter(tugas => {
                                listTugas.addFields({
                                    name: `${tugas.judul}`,
                                    value: `${tugas.matkul} - ${tugas.deadline.toString().substring(0,15)} - ${tugas.kelas}`
                                })
                            })
                            
                            message.channel.send(listTugas)
                        }).catch(err => {
                            console.log(err)
                            message.channel.send("(!) Ada kesalahan pada database, silahkan kontak maintainer")
                        })
    }
}
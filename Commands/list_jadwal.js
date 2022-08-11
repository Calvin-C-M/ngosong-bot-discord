const jadwalModel = require('../models/jadwalModel')
const Discord = require('discord.js')

const CURRENT_SEMESTER=3

const listJadwal=new Discord.MessageEmbed()
.setColor("#304281")
.setTitle("Jadwal Kelas")

module.exports = {
    name: "list_jadwal",
    description: "Jadwal Mata Kuliah",
    async execute(message,kelas) {
        listJadwal.setTitle(`Jadwal Kelas ${kelas}`)

        await jadwalModel.find({ semester: CURRENT_SEMESTER, kelas: `${kelas}` })
        .then(jadwalData => {
            const jadwalFields=[
                {hari: "Senin", value: ""}, {hari: "Selasa", value: ""}, {hari: "Rabu", value: ""},
                {hari: "Kamis", value: ""}, {hari: "Jumat", value: ""}
            ]

            jadwalData.filter(jadwal => {
                const indexData=jadwalFields.map(field => field.hari).indexOf(jadwal.hari)
                jadwalFields[indexData].value += jadwal.matkul + ": " + jadwal.jam + "\n"
            })

            jadwalFields.forEach(jadwal => {
                listJadwal.addFields({
                    name: jadwal.hari,
                    value: (jadwal.value==="") ? "kosong" : jadwal.value
                })
            })

            message.channel.send(listJadwal)
        })
        .catch(err => {
            console.log(err)
            message.channel.send('(!) Ada kesalahan pada database, silahkan kontak maintainer')
        })
    }
}
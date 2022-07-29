const tugasModel=require('../models/tugasSchema')

module.exports={
    name: "add_tugas",
    desc: "Insert tugas data to database",
    execute(message,data) {
        setTimeout(() => message.delete(), 500)

        const datePattern=/\d{4}-\d{2}-\d{2}/

        if(datePattern.test(data.deadline)) {
            tugasModel.create({
                judul: data.judul,
                matkul: data.matkul,
                kelas: data.kelas,
                deadline: data.deadline,
            }).then(() => {
                message.channel.send(`Tugas ${data.judul} untuk mata kuliah ${data.matkul} berhasil disimpan!`)
            }).catch(err => {
                console.log(err)
            })
        } else {
            message.channel.send('Format deadline salah!')
            message.channel.send('Format deadline: yyyy-mm-dd')
        }

    }
}
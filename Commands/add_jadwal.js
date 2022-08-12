const jadwalModel=require('../models/jadwalModel')

const dataIsValid = (data) => {
    const schedPattern=/\d{2}.\d{2}-\d{2}.\d{2}/
    const classPattern=/[ab]/i
    const dayPattern=/(senin|selasa|rabu|kamis|jumat)/i
    const semesterPattern=/[1-8]/

    return (
        schedPattern.test(data.jam) && 
        classPattern.test(data.kelas) &&
        dayPattern.test(data.hari) &&
        semesterPattern.test(data.semester)
    )
}

module.exports={
    name: "add_jadwal",
    description: "Add new jadwal document to collection",
    execute(message,data) {
        if(dataIsValid(data)) {
            setTimeout(() => message.delete(),300)

            jadwalModel.create({
                matkul: data.matkul,
                jam: data.jam,
                hari: data.hari,
                kelas: data.kelas,
                semester: data.semester,
            }).then(() => {
                message.channel.send(`Jadwal matkul ${data.matkul} untuk kelas ${data.kelas} berhasil ditambah!`)
            }).catch(err => console.log(err))

        } else {
            message.channel.send('Data tidak berhasil ditambah, ada kesalahan dalam format command')
        }

    }
}
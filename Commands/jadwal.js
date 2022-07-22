module.exports = {
    name: "jadwal",
    description: "Jadwal Mata Kuliah",
    execute(message,args,Discord,connection) {
        connection.connect(err => {
            if(err) throw err;

            const query=`SELECT hari.hari as day, matkul.nama AS study, kelas.kelas as class, jadwal.jam as time
                         FROM hari,matkul,kelas,jadwal
                         WHERE jadwal.matkul=matkul.kode_matkul
                         AND jadwal.hari=hari.kode_hari
                         AND jadwal.kelas=kelas.kode_kelas;`

            connection.query(query, (err,res,fields) => {
                if(err) throw err;

                // console.log(res)

                const jadwal = res
            })
        })
    }
}
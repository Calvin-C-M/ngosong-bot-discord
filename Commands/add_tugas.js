module.exports={
    name: "add_tugas",
    desc: "Insert tugas data to database",
    execute(message,connection,data) {
        setTimeout(() => message.delete(), 500) 

        const query=`INSERT INTO tugas (judul,matkul,deadline,kelas) VALUES ('${data.judul}', '${data.matkul}', '${data.deadline}', '${data.kelas}')`

        connection.query(query, (err,res) => {
            if(err) throw err

            message.channel.send('Data tugas berhasil disimpan!')
        })
    }
}
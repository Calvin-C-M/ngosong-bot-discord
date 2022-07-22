const makeJadwal = (dayVar) => {

	let jadwalValue=""

	if(dayVar.length > 0) {
		dayVar.forEach(data => {
			jadwalValue += (data.study + ": " + data.time + '\n')
		})	
		return jadwalValue
	}
	return "Jadwal Kosong"
}

module.exports = {
    name: 'jadwal_kelas_b',
    description: 'Jadwal kuliah Kelas B',
    execute(message, args, Discord, connection) {
		connection.connect(err => {
			if(err) throw err;

			const query=`SELECT hari.hari as day, matkul.nama AS study, kelas.kelas as class, jadwal.jam as time
						 FROM hari,matkul,kelas,jadwal
						 WHERE jadwal.matkul=matkul.kode_matkul
						 AND jadwal.hari=hari.kode_hari
						 AND jadwal.kelas=kelas.kode_kelas
						 AND jadwal.kelas='B';`

			connection.query(query, (err,res,fields) => {
				if(err) throw err;

				const senin=makeJadwal(res.filter(data => data.day === "Senin"))
				const selasa=makeJadwal(res.filter(data => data.day === "Selasa"))
				const rabu=makeJadwal(res.filter(data => data.day === "Rabu"))
				const kamis=makeJadwal(res.filter(data => data.day === "Kamis"))
				const jumat=makeJadwal(res.filter(data => data.day === "Jumat"))

				const jadwalKuliah=new Discord.MessageEmbed()
				.setColor('#304281')
				.setTitle('Jadwal Ngosong Kelas B')
				.setDescription('Semester 4')
				.addFields(
					{ name: 'Senin', value: `${senin}`},
					{ name: 'Selasa', value: `${selasa}` },
					{ name: 'Rabu', value: `${rabu}` },
					{ name: 'Kamis', value: `${kamis}` },
					{ name: 'Jumat', value: `${jumat}` },
				)

				message.channel.send(jadwalKuliah)
			})

		})
    }
}
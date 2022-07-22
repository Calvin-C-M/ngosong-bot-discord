module.exports = {
    name: 'help',
    description: 'List of commands',
    execute(message, Discord){
		const embed = new Discord.MessageEmbed()
		.setColor()
		.setTitle('Daftar Perintah Killer Bot')
		.setDescription('Sung dicek aja\nInget prefixnya itu \'.\' yaa')
		.addFields(
		    { name: 'help', value: 'Nampilin semua daftar perintah' },
		    { name: 'ping', value: 'Buat ngetes' },
		    { name: 'jadwal', value: 'Nampilin jadwal kuliah ngosong' },
		    { name: 'jadwal {kelas}', value: 'Nampilin jadwal kuliah kelas' },
		    { name: 'hadir', value: "Mengabsensi di discord" },
		    { name: "tebak angka {angka}", value: "Tebak angka dari 1-100, kalo bener nopal kasih hadiah" },
		    { name: "tebak hewan {hewan}", value: "Tebak hewan, random bener bener random hewannya" },
		    { name: "colek", value: "Ngajak ribut si botnya" },
		    { name: "tag {tag_name} {jumlah}", value: "Ngespam seseorang" },
			{ name: "tod", value: "Main Truth or Dare" }
		)

		message.channel.send(embed);
    }
}
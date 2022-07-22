module.exports={
    name: 'link_penting',
    desc: 'Sends important link for the channel',
    execute(message,Discord) {
        const embed=new Discord.MessageEmbed()
        .setColor()
        .setTitle("Link Penting")
        .setDescription("Kumpulan link penting ngosong")
        .addFields(
            { name: "PACIS", value: "https://students.unpad.ac.id" },
            { name: "Live Unpad", value: "https://reguler.live.unpad.ac.id/" }
        )

        message.channel.send(embed)
    }
}
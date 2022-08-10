module.exports={
    name: "add_jadwal",
    description: "Add new jadwal document to collection",
    execute(message,data) {
        setTimeout(() => message.delete(),300)
        console.log(data)
        message.channel.send('Data jadwal berhasil ditambah!')
    }
}
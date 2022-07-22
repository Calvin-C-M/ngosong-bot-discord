module.exports={
    name: "absen",
    desc: "Role call in discord channel",
    execute(message,user) {
        setTimeout(() => {
            message.delete()
        },300)

        message.channel.send(`${user} telah hadir ngab`)
    }
}
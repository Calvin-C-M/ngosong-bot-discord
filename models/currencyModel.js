const mongoose = require('mongoose')

const schema = mongoose.Schema({
    discord_id: { type: String, require: true, unique: true },
    balance: { type: Number, require: true }
})

const model = mongoose.model("CurrencyModel",schema)

module.exports = model
const mongoose = require('mongoose')

const schema=mongoose.Schema({
    matkul: { type: String, require: true },
    kelas: { type: String, require: true },
    hari: { type: String, require: true },
    jam: { type: String, require: true },
    semester: { type: Number, require: true }
})

const model=mongoose.model("JadwalModel",schema)

module.exports=model
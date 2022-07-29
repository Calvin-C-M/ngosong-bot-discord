const mongoose = require('mongoose')

const schema=new mongoose.Schema({
    judul: { type: String, require: true },
    matkul: { type: String, require: true },
    kelas: { type: String, require: true },
    deadline: { type: Date, require: true },
})

const model=mongoose.model("TugasModel",schema)

module.exports=model
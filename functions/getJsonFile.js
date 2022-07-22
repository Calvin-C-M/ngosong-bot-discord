const fs=require('fs')
module.exports = (file="") => JSON.parse(fs.readFileSync(file).toString())
const mongoose = require('mongoose');

const dealerSchema = mongoose.Schema({
    username:{type:String, required:true},
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true}
}, {versionKey:false});

const DealerModel = mongoose.model('dealer', dealerSchema)
module.exports = {DealerModel};
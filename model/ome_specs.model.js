const mongoose = require('mongoose');

const specsSchema = mongoose.Schema({
    model:{type:String, required:true},
    year:{type:Number, required:true},
    price:{type:Number, required:true},
    color:{type:[String], required:true},
    mileage:{type:Number, required:true}, 
    power:{type:Number, required:true},
    max_speed:{type:Number, required:true}
}, {versionKey:false});
const SpecsModel = mongoose.model('OEM_Spec', specsSchema);

module.exports = {SpecsModel};
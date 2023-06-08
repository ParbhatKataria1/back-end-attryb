const mongoose = require('mongoose');

const inventorySchema = mongoose.Schema({
    image:{type:String, required:true},
    odometer:{type:Number, required:true},
    scratches:{type:Number, required:true},
    original_paint:{type:String, required:true},
    reported_accident:{type:Number, required:true},
    previous_buyer:{type:Number, required:true},
    registration_place:{type:String, required:true},
    oem_spec:{type:mongoose.Schema.Types.ObjectId, ref:'OEM_Spec', required:true},
    dealer:{type:mongoose.Schema.Types.ObjectId, ref:'dealer', required:true},
    description:{type:[String], required:true},
    title:{type:String, required:true}
}, {versionKey:false})

const InventoryModel = mongoose.model(  'Marketplace_Inventory' , inventorySchema);

module.exports = {InventoryModel}
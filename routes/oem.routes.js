const express = require("express");
const { SpecsModel } = require("../model/ome_specs.model");
const oem = express.Router();


oem.get('/', async(req, res)=>{
    const {model} = req.query;
    try {
        const obj = {};
        if(model)obj.model = new RegExp(model, 'i');
        let data = await SpecsModel.find(obj);
        res.status(200).send(data);
    } catch (error) {
        res.status(400).send('Not able to get the data')
    }
})

oem.post("/", async (req, res) => {
  const body = req.body;
  try {
    let data = new SpecsModel(body);
    await data.save()
    res.status(201).send({ msg: "OEM is created" });
  } catch (error) {
    res.status(400).send({ msg: "error in creating new OEM" });
  }
});



module.exports = { oem };

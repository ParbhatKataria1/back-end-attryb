const express = require("express");
const { InventoryModel } = require("../model/inventory.model");
const inventory = express.Router();

inventory.get("/", async (req, res) => {
  const userid = req.headers.userid;
  try {
    const obj = req.query;

    let data;
    if (obj.limit) {
      data = await InventoryModel.find()
        .populate("oem_spec")
        .populate("dealer")
        .skip(obj.page)
        .limit(obj.limit);
    } else {
      data = await InventoryModel.find()
        .populate("oem_spec")
        .populate("dealer");
    }

    if (obj.model)
      data = data.filter((el) =>
        el.oem_spec.model.match(new RegExp(obj.model, "i"))
      );
    if (obj.color)
      data = data.filter((el) => el.oem_spec.color.includes(obj.color));
    if (obj.min_price)
      data = data.filter((el) => el.oem_spec.price >= obj.min_price);
    if (obj.max_price)
      data = data.filter((el) => el.oem_spec.price <= obj.max_price);
    if (obj.min_mileage)
      data = data.filter((el) => el.oem_spec.mileage >= obj.min_mileage);
    if (obj.max_mileage)
      data = data.filter((el) => el.oem_spec.mileage <= obj.max_mileage);

    res.status(200).send({ data, userid });
  } catch (error) {
    res.status(400).send("Not able to get the data");
  }
});

inventory.post("/", async (req, res) => {
  const userid = req.headers.userid;
  const body = req.body;
  try {
    const item = new InventoryModel({ dealer: userid, ...body });
    await item.save();
    res.status(201).send("Item is created");
  } catch (error) {
    res.status(400).send("Not able to create the Item");
  }
});

inventory.patch("/:_id", async (req, res) => {
  const userid = req.headers.userid;
  const { _id } = req.params;
  const body = req.body;
  try {
    const data = await InventoryModel.findById({ _id });
    if (data?.dealer == userid) {
      let data = await InventoryModel.findByIdAndUpdate({ _id }, body, {
        new: true,
      });
      res.status(202).send(data);
    } else {
      res.status(401).send("Your are not allowed to change this Item");
    }
  } catch (error) {
    res.status(400).send("Error in updating the data");
  }
});

inventory.delete("/:_id", async (req, res) => {
  const userid = req.headers.userid;
  const { _id } = req.params;
  try {
    const data = await InventoryModel.findById({ _id });
    if (data?.dealer == userid) {
      let data = await InventoryModel.findByIdAndDelete({ _id });
      res.status(202).send(data);
    } else {
      res.status(401).send("Your are not allowed to delete this Item");
    }
  } catch (error) {
    res.status(400).send("Error in Deleting the data");
  }
});

module.exports = { inventory };

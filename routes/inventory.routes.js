const express = require("express");
const { InventoryModel } = require("../model/inventory.model");
const inventory = express.Router();
const {upload} = require('../utils/multer');

inventory.get("/", async (req, res) => {
  const userid = req.headers.userid;
  try {
    const obj = req.query;
    let length = await InventoryModel.find();
    length = length.length;
    let data;
    if (obj.limit) {
      let page = +obj.page || 1;
      let limit = +obj.limit;
      console.log(page, limit)
      data = await InventoryModel.find()
        .skip((page-1)*(limit))
        .limit(limit)
        .populate("oem_spec")
        .populate("dealer");
    } else {
      data = await InventoryModel.find()
        .populate("oem_spec")
        .populate("dealer");
    }
    if (!+obj.max_price) obj.max_price = Infinity;
    if (!+obj.max_mileage) obj.max_mileage = Infinity;
    if (obj.model)
      data = data.filter((el) =>
        el.oem_spec.model.match(new RegExp(obj.model, "i"))
      );
    if (obj.color)
      data = data.filter((el) => el.oem_spec.color.includes(obj.color));
    if (+obj.min_price)
      data = data.filter((el) => +el.oem_spec.price >= +obj.min_price);
    if (+obj.max_price)
      data = data.filter((el) => +el.oem_spec.price <= +obj.max_price);
    if (+obj.min_mileage)
      data = data.filter((el) => +el.oem_spec.mileage >= +obj.min_mileage);
    if (+obj.max_mileage)
      data = data.filter((el) => +el.oem_spec.mileage <= +obj.max_mileage);

    res.status(200).send({ data, userid, length });
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


inventory.post("/image",upload.single('image'), async (req, res) => {
  const userid = req.headers.userid;
  const body = req.body;
  try {
    let image = await cloudinary_js_config.uploader.upload(req.file.path);
    image = image.secure_url;
    body.image = image
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
inventory.get("/:_id", async (req, res) => {
  const _id = req.params;
  try {
    let data = await InventoryModel.findById(_id)
      .populate("oem_spec")
      .populate("dealer");

    res.status(200).send(data);
  } catch (error) {
    res.status(400).send("Not able to get the data");
  }
});

module.exports = { inventory };

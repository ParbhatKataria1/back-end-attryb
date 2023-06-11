const express = require("express");
const { InventoryModel } = require("../model/inventory.model");
const inventory = express.Router();
require("dotenv").config();

// const { upload } = require("../utils/multer");
// const cloudinary = require("../utils/cloudinary").v2;
// const cloudinary = require("cloudinary").v2;

// cloudinary.config({
//   cloud_name: process.env.cloud_name,
//   api_key: process.env.cloud_api_key,
//   api_secret: process.env.cloud_api_secret,
// });

inventory.get("/", async (req, res) => {
  const userid = req.headers.userid;
  try {
    const obj = req.query;
    let length;
    let data;
    let page = +obj.page || 1;
    let limit = +obj.limit || 6;
    data = await InventoryModel.find()
      .populate("oem_spec")
      .populate("dealer");
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
      length = data.length;
    data = data.filter((el, ind) => (page-1)*limit<=ind && ind<page*limit);
    
    res.status(200).send({ data, userid, length });
  } catch (error) {
    res.status(400).send("Not able to get the data");
  }
});

// inventory.post("/", upload.single("image"), async (req, res) => {
//   const userid = req.headers.userid;
//   const body = req.body;
//   try {
//     console.log(req?.file?.path);
//     if (req?.file?.path) {
//       let image = "";
//       image = await cloudinary.uploader.upload(req.file.path);
//       image = image.secure_url;
//       body.image = image;
//     }
//     let temp = {...body}
//     console.log(temp);
//     const item = new InventoryModel({ ...temp, dealer: userid });
//     await item.save();
//     res.status(201).send("Item is created");
//   } catch (error) {
//     res.status(400).send("Not able to create the Item");
//   }
// });

inventory.post("/", async (req, res) => {
  const userid = req.headers.userid;
  const body = req.body;
  try {
    const item = new InventoryModel({ ...body, dealer: userid });
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

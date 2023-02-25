const express = require("express");
const { body, validationResult } = require("express-validator");
const { VarifyToken } = require("../middlewares/VarifyToken");
const { AuthModel } = require("../models/Auth.model");
const { ProdModel } = require("../models/product.mpdel");
const productsRouter = express.Router();

productsRouter.get("/", async (req, res) => {
  const products = await ProdModel.find();
  res.send(products);
});

productsRouter.post(
  "/add",
  [
    body("url", "Enter an imgUrl").not().isEmpty(),
    body("price", "Enter product price").not().isEmpty(),
    body("dPrice", "Enter discount price").not().isEmpty(),
    body("brand", "Enter brand name").not().isEmpty(),
    body("name", "Enter product name").not().isEmpty(),
  ],
  VarifyToken,
  async (req, res) => {
    try {
      const error = validationResult(req);
      if (!error.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      // let id = req.authId;
      // let isAuth = await AuthModel.findOne({ _id: id });
      // if (!isAuth.isAdmin) {
      //   res.status(401).send({ msg: "you dont have permission to add cars" });
      // }

      let { url, price, dPrice, brand, name } = req.body;

      let createProd = await ProdModel.create({
        url,
        price,
        dPrice,
        brand,
        name,
      });
      if (createProd) {
        res.status(200).send({ msg: "Car Added Successfully!" });
      }
    } catch (er) {
      res.status(500).send({ msg: "Somthing Went Wrong In Car add", error });
    }
  }
);

productsRouter.delete("/delete/:id", VarifyToken, async (req, res) => {
  try {
    let prodid = req.params.id;

    await ProdModel.findByIdAndDelete({ _id: prodid });
    res.send({ msg: "Product deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .send({ msg: "Somthing Went Wrong In deleting cars", error });
  }
});

productsRouter.patch("/updateprod/:id", async (req, res) => {
  try {
    let prodsid = req.params.id;

    let payload = req.body;
    await ProdModel.findByIdAndUpdate({ _id: prodsid }, payload);
    res.send({ msg: "car updated successfully" });
  } catch (error) {
    res
      .status(500)
      .send({ msg: "Somthing Went Wrong In updating cars", error });
  }
});

module.exports = { productsRouter };

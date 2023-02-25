const express = require("express");
const { connection } = require("./configs/db");
const { VarifyToken } = require("./middlewares/VarifyToken");
require("dotenv").config();
const cors = require("cors");
const { authRouter } = require("./routes/Auth.router");
const { productsRouter } = require("./routes/products.router");

const app = express();
app.use(express.json());
app.use(cors());
app.use("/auth", authRouter);
app.use("/products", productsRouter);

app.get("/", (req, res) => {
  res.send("Home Page");
});

app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log("DB connected");
  } catch (err) {
    console.log("Error while connecting DB");
    console.log(err);
  }
  console.log(`${process.env.port}port Connected`);
});

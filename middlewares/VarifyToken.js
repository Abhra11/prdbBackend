const jwt = require("jsonwebtoken");
require("dotenv").config();
const secretkey = process.env.secretkey;

const VarifyToken = (req, res, next) => {
  try {
    let token = req.headers.authtoken || null;
    if (!token) {
      return res.status(401).send({ msg: "Please Login First" });
    }

    jwt.verify(token, secretkey, (err, decode) => {
      if (err) {
        res.status(500).send({ msg: "Please Login First" });
      } else {
        let authId = decode._id;
        req.authId = authId;
        next();
      }
    });
  } catch (err) {
    res.status(500).send({ msg: "Somthing Wrong with token", error });
  }
};

module.exports = { VarifyToken };

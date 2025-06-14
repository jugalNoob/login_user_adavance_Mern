const express = require("express");
const router = express.Router();
const NorthData=require("../controller/North")
const SouthData=require("../controller/South")
// const { sendNorthMessage } = require("../producer/producer_north");

router.post("/send", async (req, res) => {

});

router.post('/v1/North', NorthData.NorthData)
router.post('/v1/South', SouthData.SouthData)

module.exports = router;

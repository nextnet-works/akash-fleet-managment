"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get("/", (req, res) => {
  console.log("Fetch bids request received");
  // Example data returned
  const bids = [
    { id: 1, amount: 100, bidder: "Alice" },
    { id: 2, amount: 150, bidder: "Bob" },
  ];
  res.status(200).json(bids);
});
exports.default = router;
//# sourceMappingURL=bids.js.map

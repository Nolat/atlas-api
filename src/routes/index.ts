import * as express from "express";

const router = express.Router();

// ? GET index
router.get("/", (req, res) => {
  res.sendStatus(200);
});

export default router;

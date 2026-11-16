import express from "express";
import { ReviewController } from "../controllers/reviewController.js";

const router = express.Router();

router.get("/", ReviewController.getAll);
router.get("/restaurant/:restaurantId", ReviewController.getByRestaurant);
router.post("/", ReviewController.create);
router.delete("/:id", ReviewController.remove);

export default router;

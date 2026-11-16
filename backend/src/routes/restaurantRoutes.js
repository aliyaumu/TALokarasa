import express from "express";
import { RestaurantController } from "../controllers/restaurantController.js";

const router = express.Router();

router.get("/", RestaurantController.getAll);
router.get("/:id", RestaurantController.getById);
router.post("/", RestaurantController.create);
router.put("/:id", RestaurantController.update);
router.delete("/:id", RestaurantController.remove);

export default router;

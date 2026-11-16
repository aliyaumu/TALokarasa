import { ReviewModel } from "../models/reviewModel.js";

export const ReviewController = {
  async getByRestaurant(req, res) {
    try {
      const { restaurantId } = req.params;
      const reviews = await ReviewModel.getByRestaurantId(restaurantId);
      res.json(reviews);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getAll(req, res) {
    try {
      const reviews = await ReviewModel.getAll();
      res.json(reviews);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async create(req, res) {
    try {
      const { restaurant_id, user_name, rating, comment } = req.body;
      if (!restaurant_id) {
        return res.status(400).json({ error: "restaurant_id wajib diisi" });
      }
      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ error: "Rating harus berupa angka 1 - 5" });
      }

      const review = await ReviewModel.create({
        restaurant_id,
        user_name,
        rating,
        comment,
      });

      res.status(201).json(review);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async remove(req, res) {
    try {
      const { id } = req.params;
      const result = await ReviewModel.remove(id);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
};

import { RestaurantModel } from "../models/restaurantModel.js";

export const RestaurantController = {
  async getAll(req, res) {
    try {
      const restaurants = await RestaurantModel.getAll(req.query);
      res.json(restaurants);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const restaurant = await RestaurantModel.getById(id);
      res.json(restaurant);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  },

  async create(req, res) {
    try {
      const { name, category_id, category_name, address, city, price_range, avg_price, rating, description, image_url, phone, opening_hours, is_recommended, signature_menu } = req.body;

      if (!name || name.trim().length < 3) {
        return res.status(400).json({ error: "Nama tempat makan minimal 3 karakter" });
      }

      const restaurant = await RestaurantModel.create({
        name,
        category_id,
        category_name,
        address,
        city,
        price_range,
        avg_price,
        rating,
        description,
        image_url,
        phone,
        opening_hours,
        is_recommended,
        signature_menu,
      });

      res.status(201).json(restaurant);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const restaurant = await RestaurantModel.update(id, req.body);
      res.json(restaurant);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async remove(req, res) {
    try {
      const { id } = req.params;
      const result = await RestaurantModel.remove(id);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
};

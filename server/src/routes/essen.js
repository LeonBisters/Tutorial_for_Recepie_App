import express from "express";
import mongoose from "mongoose";
import { EssenModel } from "../models/Essen.js";
import { UserModel } from "../models/Users.js";
import { verifyToken } from "./users.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const response = await EssenModel.find({});
    res.json(response);
  } catch (err) {
    res.json(err);
  }
});

router.post("/", verifyToken, async (req, res) => {
  const essen = new EssenModel(req.body);
  try {
    const response = await essen.save();
    res.json(response);
  } catch (err) {
    res.json(err);
  }
});

//Zum bearbeiten
router.put("/:id", verifyToken, async (req, res) => {
  const { id } = req.params; // Die ID des zu bearbeitenden Essens

  try {
    const updatedEssen = await EssenModel.findByIdAndUpdate(
      id, // ID des Essens
      { $set: req.body }, // Neue Daten für das Essen
      { new: true } // Rückgabe des aktualisierten Eintrags
    );

    res.json(updatedEssen);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Zum Löschen
router.delete("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedEssen = await EssenModel.findByIdAndDelete(id);
    res.json(deletedEssen);
  } catch (err) {
    res.status(500).json(err);
  }
});

export { router as essenRouter };

import express from "express";
import { BewertungModel } from "../models/Bewertung.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const response = await BewertungModel.find({});
    res.json(response);
  } catch (err) {
    res.json(err);
  }
});

router.post("/", async (req, res) => {
  const bewertung = new BewertungModel(req.body);
  try {
    const response = await bewertung.save();
    res.json(response);
  } catch (err) {
    res.json(err);
  }
});

//Zum bearbeiten
router.put("/:id", async (req, res) => {
  const { id } = req.params; // Die ID des zu bearbeitenden Essens

  try {
    const updatedEssen = await BewertungModel.findByIdAndUpdate(
      id, // ID des Essens
      { $set: req.body }, // Neue Daten für das Essen
      { new: true } // Rückgabe des aktualisierten Eintrags
    );

    res.json(updatedEssen);
  } catch (err) {
    res.status(500).json(err);
  }
});

export { router as bewertungRouter };

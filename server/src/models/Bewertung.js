import mongoose from "mongoose";

const BewertungSchema = new mongoose.Schema({
  stars: { type: Number, required: true, min: 1, max: 5 }, // Sternebewertung von 1 bis 5
  comment: { type: String, required: true }, // Kommentar ist erforderlich
});

export const BewertungModel = mongoose.model("bewertungen", BewertungSchema);

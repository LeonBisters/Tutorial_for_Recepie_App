import mongoose from "mongoose";

const BewertungSchema = new mongoose.Schema({
  stars: { type: Number, required: true, min: 1, max: 5 }, // Sternebewertung von 1 bis 5
  comment: { type: String, required: true }, // Kommentar ist erforderlich
  essenId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "essen",
    required: true,
  }, // Verknüpfung mit dem Essen
});

export const BewertungModel = mongoose.model("bewertungen", BewertungSchema);

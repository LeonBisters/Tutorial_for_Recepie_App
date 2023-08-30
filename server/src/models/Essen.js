import mongoose from 'mongoose';

const EssenSchema = new mongoose.Schema({
    name: {type: String, required: true,},
    preis: {type: Number, step:"0.01", required: true},
    art: {type: String, enum: ["vegetarisch", "vegan", "mit Fleisch"]},
});

export const EssenModel = mongoose.model("essen", EssenSchema);

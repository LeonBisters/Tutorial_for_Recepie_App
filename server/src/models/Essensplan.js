import mongoose from 'mongoose';

const SelectedEssenSchema = new mongoose.Schema({
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'essen' },
    name: String
});

const EssenPlanSchema = new mongoose.Schema({
    wochenNummer: { type: Number, required: true },
    essenProWoche: {
        montag: SelectedEssenSchema,
        dienstag: SelectedEssenSchema,
        mittwoch: SelectedEssenSchema,
        donnerstag: SelectedEssenSchema,
        freitag: SelectedEssenSchema
    }
});

export const EssenPlanModel = mongoose.model("essenPlan", EssenPlanSchema);

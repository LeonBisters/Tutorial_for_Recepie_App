import mongoose from 'mongoose';

const EssenPlanSchema = new mongoose.Schema({
    wochenNummer: {type: Number, required: true},
    //essenProWoche: //TODO hier muss noch die Struktur für die essenProWoche hinzugefügt werden  
});

export const EssenPlanModel = mongoose.model("essenPlan", EssenPlanSchema);
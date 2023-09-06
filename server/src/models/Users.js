//Diese und alle weiteren Datein im Ordner Models definieren spezielle Datenbank-Tabellen in diesem Fall für User
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  Essensbewertung: [
    { type: mongoose.Schema.Types.ObjectId, ref: "bewertungen" },
  ],
});

export const UserModel = mongoose.model("users", UserSchema);

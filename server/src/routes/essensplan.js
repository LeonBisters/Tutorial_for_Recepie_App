import express from 'express';
import mongoose from 'mongoose';
import { EssenPlanModel } from "../models/Essensplan.js";
import { UserModel } from '../models/Users.js';
import {verifyToken} from "./users.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const response = await EssenPlanModel.find({});
        res.json(response);
    } catch (err) {
        res.json(err);
    }
});

router.post("/", verifyToken, async (req, res) => {
    const essen = new EssenPlanModel(req.body);
    try {
        const response = await essen.save();
        res.json(response);
    } catch (err) {
        res.json(err);
    }
});

router.put("/", verifyToken, async (req, res) => {
    try {
        const essen = await EssenPlanModel.findById(req.body.essenID);
        const user = await UserModel.findById(req.body.userID);
        user.savedRecipes.push(essen);
        await user.save();
        res.json({savedRecipes: user.savedRecipes});
    } catch (err) {
        res.json(err);
    }
});

router.get("/savedRecipes/ids/:userID", async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.userID);
        res.json({savedRecipes : user?.savedRecipes});
    } catch (err) {
        res.json(err);
    }
});

router.get("/savedRecipes/:userID", async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.userID);
        const savedRecipes = await RecipeModel.find({
            _id: {$in: user.savedRecipes},
        })
        res.json({savedRecipes});
    } catch (err) {
        res.json(err);
    }
});


//Zum bearbeiten
router.put("/:id", verifyToken, async (req, res) => {
    const { id } = req.params; // Die ID des zu bearbeitenden Essens

    try {
        const updatedEssen = await EssenPlanModel.findByIdAndUpdate(
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
        const deletedEssen = await EssenPlanModel.findByIdAndDelete(id);
        res.json(deletedEssen);
    } catch (err) {
        res.status(500).json(err);
    }
});



export {router as essensplanRouter};


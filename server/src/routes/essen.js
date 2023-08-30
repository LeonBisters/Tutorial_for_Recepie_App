import express from 'express';
import mongoose from 'mongoose';
import { EssenModel } from "../models/Essen.js";
import { UserModel } from '../models/Users.js';
import {verifyToken} from "./users.js";

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

router.put("/", verifyToken, async (req, res) => {
    try {
        const essen = await EssenModel.findById(req.body.essenID);
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
        const savedRecipes = await EssenModel.find({
            _id: {$in: user.savedRecipes},
        })
        res.json({savedRecipes});
    } catch (err) {
        res.json(err);
    }
});

export {router as essenRouter};


import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserModel } from "../models/Users.js";

const router = express.Router();

router.post("/register", async (req, res) => {
    const {username, password} = req.body;
    const user = await UserModel.findOne({username});

    if (user){
        return res.json({message: "User alredy exists~!"});
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new UserModel({username, password: hashedPassword});
    await newUser.save();

    res.json({message: "User registered succsessfully"});
});

router.post("/login", async (req, res) => {
    const {username, password} = req.body;
    const user = await UserModel.findOne({username});

    if (!user){
        return res.json({message: "User does not exist!"});
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
        return res.json({message: "Username or password is incorrect!"});
    }

    const token = jwt.sign({id: user.id}, "secret");
    res.json({token, userID: user._id});
});

export {router as userRouter};

export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
        jwt.verify(token, "secret", (err) => {
            if (err) return res.sendStatus(403);
                next();
        });
    } else {
        res.sendStatus(401);
    }
}
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controller/auth.controller");
const auth_1 = require("../middleware/auth");
exports.authRouter = express_1.default.Router();
exports.authRouter.post("/register", auth_controller_1.register);
exports.authRouter.post("/login", auth_controller_1.login);
exports.authRouter.post("/verify-email", auth_controller_1.verify);
exports.authRouter.post("/password-reset", auth_controller_1.recoverPassword);
exports.authRouter.post("/set-password", auth_controller_1.setPassword);
exports.authRouter.get("/validate-token", auth_controller_1.validateToken);
exports.authRouter.post("/refresh-token", auth_controller_1.refreshAccessToken);
exports.authRouter.post("/logout", auth_controller_1.logout);
exports.authRouter.get("/check-auth", auth_1.RequireAuth, (req, res) => {
    res
        .status(200)
        .json({ message: "success", user: req.user });
    return;
});

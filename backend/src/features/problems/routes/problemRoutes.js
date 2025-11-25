import {Router } from "express";

import { createProblemController, updateProblemController, deleteProblemController,listProblemsController, getProblemController} from "../controller/problemController.js";
import { role } from "../../../middlewares/roleMiddleware.js"
import { authMiddleware } from "../../../middlewares/authMiddleware.js";

const router = Router();

router.get("/", listProblemsController);


"use strict";
// server/routes/branchRoutes.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const branchController_1 = require("../controllers/branchController");
const auth_1 = require("../middleware/auth");
const itemRoutes_1 = __importDefault(require("./itemRoutes")); // Import item routes
const router = express_1.default.Router();
// Protect all branch routes
router.use(auth_1.authenticate);
router.use('/:branchId/items', itemRoutes_1.default); // Make sure this is correct
// Create a new branch
router.post('/', branchController_1.createBranch);
// Get all branches
router.get('/', branchController_1.getAllBranches);
// Get a single branch by ID
router.get('/:branchId', branchController_1.getBranchById);
// Additional routes for updating and deleting branches can be added here.
exports.default = router;

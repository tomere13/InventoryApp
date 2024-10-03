"use strict";
// server/routes/itemRoutes.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const itemController_1 = require("../controllers/itemController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router({ mergeParams: true });
// All item routes are nested under a branch and require authentication
router.use(auth_1.authenticate);
// Get all items for a branch
router.get('/', itemController_1.getItems);
// Get a specific item by ID
router.get('/:itemId', itemController_1.getItemById);
// Add a new item to a branch (admin only)
router.post('/', (0, auth_1.authorize)('admin'), itemController_1.addItem);
// Edit an item (admin only)
router.put('/:itemId', (0, auth_1.authorize)('admin'), itemController_1.editItem);
// Delete an item (admin only)
router.delete('/:itemId', (0, auth_1.authorize)('admin'), itemController_1.deleteItem);
exports.default = router;

"use strict";
// server/controllers/itemController.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteItem = exports.editItem = exports.addItem = exports.getItemById = exports.getItems = void 0;
const item_1 = __importDefault(require("../models/item"));
const Branch_1 = __importDefault(require("../models/Branch"));
// Get all items for a specific branch
const getItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { branchId } = req.params;
    try {
        const items = yield item_1.default.find({ branch: branchId });
        res.status(200).json(items);
    }
    catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ message: 'Server error while fetching items.' });
    }
});
exports.getItems = getItems;
// Get a single item by ID for a specific branch
const getItemById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { branchId, itemId } = req.params;
    try {
        const item = yield item_1.default.findOne({ _id: itemId, branch: branchId });
        if (!item) {
            res.status(404).json({ message: 'Item not found.' });
            return;
        }
        res.status(200).json(item);
    }
    catch (error) {
        console.error('Error fetching item:', error);
        res.status(500).json({ message: 'Server error while fetching item.' });
    }
});
exports.getItemById = getItemById;
// Add a new item to a branch
const addItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { branchId } = req.params;
    const { name, description, quantity, price } = req.body;
    if (!name || quantity == null) {
        res.status(400).json({ message: 'Name and quantity are required.' });
        return;
    }
    try {
        // Optionally, check if branch exists
        const branch = yield Branch_1.default.findById(branchId);
        if (!branch) {
            res.status(404).json({ message: 'Branch not found.' });
            return;
        }
        const newItem = new item_1.default({
            name: name.trim(),
            description: description === null || description === void 0 ? void 0 : description.trim(),
            quantity,
            price,
            branch: branchId,
        });
        yield newItem.save();
        res.status(201).json(newItem);
    }
    catch (error) {
        console.error('Error adding item:', error);
        res.status(500).json({ message: 'Server error while adding item.' });
    }
});
exports.addItem = addItem;
// Edit an existing item
const editItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { branchId, itemId } = req.params;
    const { name, description, quantity, price } = req.body;
    try {
        const item = yield item_1.default.findOne({ _id: itemId, branch: branchId });
        if (!item) {
            res.status(404).json({ message: 'Item not found.' });
            return;
        }
        if (name)
            item.name = name.trim();
        if (description)
            item.description = description.trim();
        if (quantity != null)
            item.quantity = quantity;
        if (price != null)
            item.price = price;
        yield item.save();
        res.status(200).json(item);
    }
    catch (error) {
        console.error('Error editing item:', error);
        res.status(500).json({ message: 'Server error while editing item.' });
    }
});
exports.editItem = editItem;
// Delete an item
const deleteItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { branchId, itemId } = req.params;
    try {
        const item = yield item_1.default.findOneAndDelete({ _id: itemId, branch: branchId });
        if (!item) {
            res.status(404).json({ message: 'Item not found.' });
            return;
        }
        res.status(200).json({ message: 'Item deleted successfully.' });
    }
    catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ message: 'Server error while deleting item.' });
    }
});
exports.deleteItem = deleteItem;

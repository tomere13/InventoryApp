"use strict";
// src/routes/items.ts
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
const express_1 = require("express");
const item_1 = __importDefault(require("../models/item"));
const router = (0, express_1.Router)();
// Create an item
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const item = new item_1.default(req.body);
    try {
        const savedItem = yield item.save();
        res.status(201).json(savedItem);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}));
// Get all items
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const items = yield item_1.default.find();
        res.json(items);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}));
// Get an item by ID
router.get('/:id', getItem, (req, res) => {
    res.json(res.locals.item);
});
// Update an item
router.patch('/:id', getItem, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const item = res.locals.item;
    if (req.body.name != null) {
        item.name = req.body.name;
    }
    if (req.body.quantity != null) {
        item.quantity = req.body.quantity;
    }
    // Update other fields as needed
    try {
        const updatedItem = yield item.save();
        res.json(updatedItem);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}));
// Delete an item
router.delete('/:id', getItem, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const item = res.locals.item;
    try {
        yield item.deleteOne();
        res.json({ message: 'Item deleted' });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}));
// Middleware function to get item by ID
function getItem(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let item;
        try {
            item = yield item_1.default.findById(req.params.id);
            if (item == null) {
                return res.status(404).json({ message: 'Cannot find item' });
            }
        }
        catch (err) {
            return res.status(500).json({ message: err.message });
        }
        res.locals.item = item;
        next();
    });
}
exports.default = router;

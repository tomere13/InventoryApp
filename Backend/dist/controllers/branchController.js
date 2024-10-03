"use strict";
// server/controllers/branchController.ts
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
exports.getBranchById = exports.getAllBranches = exports.createBranch = void 0;
const Branch_1 = __importDefault(require("../models/Branch"));
// Create a new branch
const createBranch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, address } = req.body;
    if (!name || !address) {
        res.status(400).json({ message: 'Name and address are required.' });
        return;
    }
    try {
        const existingBranch = yield Branch_1.default.findOne({ name });
        if (existingBranch) {
            res.status(400).json({ message: 'Branch name already exists.' });
            return;
        }
        const newBranch = new Branch_1.default({ name, address });
        yield newBranch.save();
        res.status(201).json(newBranch);
    }
    catch (error) {
        console.error('Error creating branch:', error);
        res.status(500).json({ message: 'Server error while creating branch.' });
    }
});
exports.createBranch = createBranch;
// Get all branches
const getAllBranches = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const branches = yield Branch_1.default.find().sort({ createdAt: -1 });
        res.status(200).json(branches);
    }
    catch (error) {
        console.error('Error fetching branches:', error);
        res.status(500).json({ message: 'Server error while fetching branches.' });
    }
});
exports.getAllBranches = getAllBranches;
// Get a single branch by ID
const getBranchById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { branchId } = req.params;
    try {
        const branch = yield Branch_1.default.findById(branchId);
        if (!branch) {
            res.status(404).json({ message: 'Branch not found.' });
            return;
        }
        res.status(200).json(branch);
    }
    catch (error) {
        console.error('Error fetching branch:', error);
        res.status(500).json({ message: 'Server error while fetching branch.' });
    }
});
exports.getBranchById = getBranchById;

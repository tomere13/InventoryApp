"use strict";
// backend/src/index.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const items_1 = __importDefault(require("./routes/items"));
const auth_1 = __importDefault(require("./routes/auth"));
const branchRoutes_1 = __importDefault(require("./routes/branchRoutes"));
const sendReport_1 = __importDefault(require("./routes/sendReport"));
const reports_1 = __importDefault(require("./routes/reports"));
const app = (0, express_1.default)();
// Load environment variables
dotenv_1.default.config();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api/auth', auth_1.default);
app.use('/api/branches', branchRoutes_1.default);
app.use('/api/reports', reports_1.default); // Mount reports router once
app.use('/api/:branchId/items', items_1.default);
app.use('/api', sendReport_1.default);
// Start the server after connecting to MongoDB
const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI;
mongoose_1.default
    .connect(MONGODB_URI)
    .then(() => {
    console.log('Connected to MongoDB Atlas');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
    .catch((error) => {
    console.error('Error connecting to MongoDB', error);
});

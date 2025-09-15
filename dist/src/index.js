"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const connectionDB_1 = require("./config/connectionDB");
const index_1 = require("./routes/index");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Guard for Node 20+ only; in older Node versions this is undefined
// In cloud, environment variables are injected by the platform
if (typeof process.loadEnvFile === 'function') {
    process.loadEnvFile();
}
app.use(express_1.default.json());
const port = process.env.PORT || 3000;
app.get("/", (req, res) => {
    res.send("Osejo Was Here");
});
app.use('/api/', index_1.apiRouter);
exports.default = app;
connectionDB_1.db.then(() => app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}));
//# sourceMappingURL=index.js.map
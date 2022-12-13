"use strict";
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
exports.verificaUrls = void 0;
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const utils_1 = require("./utils");
const uuid_1 = require("uuid");
const axios_1 = __importDefault(require("axios"));
const app = (0, express_1.default)();
const port = 8092;
const fileNameDB = 'output.json';
app.use(express_1.default.json());
try {
    fs_1.default.readFileSync(fileNameDB);
}
catch (error) {
    fs_1.default.writeFile(fileNameDB, JSON.stringify({ servicos: [] }), 'utf8', function (err) {
        console.log("Aqruivo JSON Criado");
    });
}
// fs.writeFile("output.json", JSON.stringify(data), 'utf8', function (err) {
//     console.log("JSON file has been saved.");
// });
app.get('/health', (req, res) => {
    res.sendStatus(200);
});
app.post('/salvar-url', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const servico = req.body;
        servico.id = (0, uuid_1.v4)();
        yield (0, utils_1.addUrl)(servico, fileNameDB);
        res.send().status(204);
    }
    catch (error) {
        res.sendStatus(500);
    }
}));
app.get('/verificar-url/:url', (req, res) => {
    // const url = req.params.url;
    res.send().status(200);
});
app.get('/verificar-urls', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.json(yield verificaUrls()).status(200);
    }
    catch (error) {
        res.sendStatus(500);
    }
}));
app.delete('/delete-url/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        yield (0, utils_1.removeUrl)(id, fileNameDB);
        res.sendStatus(204);
    }
    catch (error) {
        res.sendStatus(500);
    }
}));
app.use('/', express_1.default.static('public'));
app.listen(port, () => {
    console.log(`service is running on port ${port}`);
});
function verificaUrls() {
    return __awaiter(this, void 0, void 0, function* () {
        let servicesOpen = [];
        let servicesClose = [];
        for (const url of yield (0, utils_1.getUrls)(fileNameDB)) {
            yield axios_1.default.get(url.url).then((response) => {
                servicesOpen.push(url);
            }).catch((error) => {
                console.log(new Date().toLocaleDateString() + ' - SERVICO: ' + url.nomeDoServico + ' - URL: ' + url.url + '- Mensagem de Erro: ' + error.message);
                servicesClose.push(url);
            });
        }
        return {
            servicesOpen: servicesOpen,
            servicesClose: servicesClose
        };
    });
}
exports.verificaUrls = verificaUrls;
//# sourceMappingURL=app.js.map
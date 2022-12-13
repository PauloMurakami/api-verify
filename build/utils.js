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
exports.removeUrl = exports.getUrls = exports.addUrl = void 0;
const fs_1 = __importDefault(require("fs"));
function addUrl(servico, fileName) {
    return __awaiter(this, void 0, void 0, function* () {
        let rawdata = fs_1.default.readFileSync(fileName);
        let data = JSON.parse(rawdata.toString());
        data.servicos.push(servico);
        console.log('serviço:', servico);
        fs_1.default.writeFile(fileName, JSON.stringify(data), 'utf8', function (err) {
            console.log("arquivo salvo.");
        });
        return;
    });
}
exports.addUrl = addUrl;
function getUrls(fileName) {
    return __awaiter(this, void 0, void 0, function* () {
        let rawdata = fs_1.default.readFileSync(fileName);
        let data = JSON.parse(rawdata.toString());
        return data.servicos;
    });
}
exports.getUrls = getUrls;
function removeUrl(id, fileName) {
    return __awaiter(this, void 0, void 0, function* () {
        let rawdata = fs_1.default.readFileSync(fileName);
        let data = JSON.parse(rawdata.toString());
        var filteredObj = data.servicos.findIndex(function (item) {
            return item.id === id;
        });
        delete data.servicos[filteredObj];
        data.servicos.splice(filteredObj, 1);
        fs_1.default.writeFile(fileName, JSON.stringify(data), 'utf8', function (err) {
            console.log("arquivo salvo.");
        });
        return;
    });
}
exports.removeUrl = removeUrl;
//# sourceMappingURL=utils.js.map
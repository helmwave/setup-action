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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.walkSync = exports.getExecutableExtension = exports.findBin = exports.download = exports.getURL = exports.run = void 0;
var util = require("util");
var os = require("os");
var fs = require("fs");
var path = require("path");
var core = require("@actions/core");
var cache = require("@actions/tool-cache");
var toolName = 'helmwave';
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var version, cachedPath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    version = core.getInput('version', { 'required': true });
                    return [4 /*yield*/, download(version)];
                case 1:
                    cachedPath = _a.sent();
                    console.log("Helmwave tool version: '".concat(version, "' has been cached at ").concat(cachedPath));
                    core.setOutput('path', cachedPath);
                    return [2 /*return*/];
            }
        });
    });
}
exports.run = run;
function getURL(version) {
    switch (os.type()) {
        case 'Linux':
            return util.format('https://github.com/helmwave/helmwave/releases/download/v%s/helmwave_%s_linux_amd64.tar.gz', version, version);
        case 'Darwin':
            return util.format('https://github.com/helmwave/helmwave/releases/download/v%s/helmwave_%s_darwin_amd64.tar.gz', version, version);
        case 'Windows_NT':
        default:
            return util.format('https://github.com/helmwave/helmwave/releases/download/v%s/helmwave_%s_windows_amd64.zip', version, version);
    }
}
exports.getURL = getURL;
function download(version) {
    return __awaiter(this, void 0, void 0, function () {
        var cached, url, downloadPath, exception_1, untarPath, pathBin;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cached = cache.find(toolName, version);
                    url = getURL(version);
                    if (!!cached) return [3 /*break*/, 7];
                    downloadPath = void 0;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, cache.downloadTool(url)];
                case 2:
                    downloadPath = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    exception_1 = _a.sent();
                    throw new Error(util.format("Failed to download Helmwave from location", url));
                case 4:
                    fs.chmodSync(downloadPath, '777');
                    return [4 /*yield*/, cache.extractTar(downloadPath)];
                case 5:
                    untarPath = _a.sent();
                    return [4 /*yield*/, cache.cacheDir(untarPath, toolName, version)];
                case 6:
                    cached = _a.sent();
                    _a.label = 7;
                case 7:
                    pathBin = findBin(cached);
                    if (!pathBin) {
                        throw new Error(util.format("Helmwave executable not found in path", cached));
                    }
                    fs.chmodSync(pathBin, '777');
                    return [2 /*return*/, pathBin];
            }
        });
    });
}
exports.download = download;
function findBin(rootDir) {
    fs.chmodSync(rootDir, '777');
    var fileList = [];
    (0, exports.walkSync)(rootDir, fileList, toolName + getExecutableExtension());
    if (!fileList || fileList.length == 0) {
        throw new Error(util.format("Helmwave executable not found in path", rootDir));
    }
    else {
        return fileList[0];
    }
}
exports.findBin = findBin;
function getExecutableExtension() {
    if (os.type().match(/^Win/)) {
        return '.exe';
    }
    return '';
}
exports.getExecutableExtension = getExecutableExtension;
var walkSync = function (dir, fileList, fileToFind) {
    var files = fs.readdirSync(dir);
    fileList = fileList || [];
    files.forEach(function (file) {
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
            fileList = (0, exports.walkSync)(path.join(dir, file), fileList, fileToFind);
        }
        else {
            core.debug(file);
            if (file == fileToFind) {
                fileList.push(path.join(dir, file));
            }
        }
    });
    return fileList;
};
exports.walkSync = walkSync;
run()["catch"](core.setFailed);

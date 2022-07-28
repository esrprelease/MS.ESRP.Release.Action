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
exports.PackageManager = void 0;
const node_fetch_commonjs_1 = __importDefault(require("node-fetch-commonjs"));
const crypto_1 = __importDefault(require("crypto"));
const fs_1 = __importDefault(require("fs"));
const path = require("path");
const package_1 = require("../../Ms.Ess.Release.Task.Common/Configuration/package");
const xml2js_1 = __importDefault(require("xml2js"));
const constants_1 = require("../../Ms.Ess.Release.Task.Common/Configuration/constants");
const config_1 = require("../../Ms.Ess.Release.Task.Common/Configuration/config");
const exceptionMessages_1 = require("../../Ms.Ess.Release.Task.Common/Exceptions/exceptionMessages");
class PackageManager {
    constructor(_config, _package) {
        this.config = (_config == undefined ? new config_1.Config() : _config);
        this.package = (_package == undefined ? new package_1.Package() : _package);
    }
    PopulatePackageDetail() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setPackageVariables();
            yield this.TestReleasePackage(this.package.RepositoryUrl, this.package);
        });
    }
    setPackageVariables() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let pomFileLocation = (_a = this.config) === null || _a === void 0 ? void 0 : _a.PackageLocation;
            const readDirMain = yield fs_1.default.promises.readdir(pomFileLocation);
            let pomFileName = readDirMain.filter(el => path.extname(el) == constants_1.Constant.PomFileExtension);
            let pomFileRaw = fs_1.default.readFileSync(path.join(pomFileLocation, pomFileName[0]), "utf8");
            const parser = new xml2js_1.default.Parser();
            parser.parseString(pomFileRaw, (error, result) => {
                if (error === null) {
                    this.package.ArtifactID = result[constants_1.Constant.Project][constants_1.Constant.ArtifactId][0];
                    this.package.Version = result[constants_1.Constant.Project][constants_1.Constant.Version][0];
                    this.package.GroupID = result[constants_1.Constant.Project][constants_1.Constant.GroupID][0];
                }
                else {
                    return new Error(error);
                }
            });
            var groupId = this.package.GroupID;
            let packageFileRaw = fs_1.default.readFileSync(path.join(__dirname, constants_1.Constant.PackageFilePath), "utf8");
            this.package.RepositoryUrl = JSON.parse(packageFileRaw).ReositoryUrl[groupId];
        });
    }
    getFileName(pathFileName) {
        var fullFileName = pathFileName.replace(/^.*[\\\/]/, '');
        return fullFileName;
    }
    getFilExtension(pathFileName) {
        var strLength = pathFileName.length;
        if (pathFileName.substring(strLength, strLength - 4) === '.jar'
            || pathFileName.substring(strLength, strLength - 8) === '.jar.asc'
            || pathFileName.substring(strLength, strLength - 15) === '.jar.asc.sha256'
            || pathFileName.substring(strLength, strLength - 11) === '.jar.sha256'
            || pathFileName.substring(strLength, strLength - 4) === '.pom'
            || pathFileName.substring(strLength, strLength - 8) === '.pom.asc'
            || pathFileName.substring(strLength, strLength - 11) === '.pom.sha256'
            || pathFileName.substring(strLength, strLength - 15) === '.pom.asc.sha256') {
            return true;
        }
        else {
            return false;
        }
    }
    TestReleasePackage(RepositoryUrl, PackageDetail) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            let baseUrl = constants_1.Constant.EmptyString;
            if (RepositoryUrl === constants_1.Constant.RepositoryUrl) {
                baseUrl = constants_1.Constant.BaseUrl;
            }
            else {
                console.log(constants_1.Constant.UrlCheck);
            }
            const packageUrl = `${baseUrl}/${(_a = PackageDetail.GroupID) === null || _a === void 0 ? void 0 : _a.replaceAll('.', '/')}/${PackageDetail.ArtifactID}/${PackageDetail.Version}`;
            let remoteCount = constants_1.Constant.InitialCountZero;
            let matchCount = constants_1.Constant.InitialCountZero;
            let packageLocation = (_b = this.config) === null || _b === void 0 ? void 0 : _b.PackageLocation;
            const readDirMain = yield fs_1.default.promises.readdir(packageLocation);
            readDirMain.forEach(artifact => {
                if (this.getFilExtension(artifact) == true) {
                    const localFileName = this.getFileName(artifact);
                    const remoteHashUrl = `${packageUrl}/${localFileName}`;
                    let response;
                    (0, node_fetch_commonjs_1.default)(remoteHashUrl).then((result) => {
                        response = result;
                        if (response.status >= 200 && response.status < 300) {
                            remoteCount++;
                            let hash = response.headers.get("etag");
                            const remoteHash = response.headers.get("etag").substring(7, hash.length - 3);
                            const localPath = `${packageLocation}/${this.getFileName(artifact)}`;
                            const fileBufer = fs_1.default.readFileSync(localPath);
                            const hashSum = crypto_1.default.createHash('sha1');
                            hashSum.update(fileBufer);
                            const localHash = hashSum.digest('hex');
                            if (remoteHash === localHash) {
                                matchCount++;
                                if (remoteCount === constants_1.Constant.TotalFilesInDirectory) {
                                    console.log(constants_1.Constant.SuccessDeployed + "\n" + constants_1.Constant.PackageUrl + packageUrl + "\n");
                                }
                            }
                            else {
                                console.log(constants_1.Constant.HashNotEqual + localFileName + '\n');
                                if (remoteCount === constants_1.Constant.TotalFilesInDirectory) {
                                    console.log(constants_1.Constant.DeployedDiffContent);
                                }
                            }
                        }
                        else {
                            console.log(exceptionMessages_1.ExceptionMessages.RemoteHashFetchingFailed + localFileName + constants_1.Constant.HttpResponseCode + response.status);
                        }
                    });
                }
            });
        });
    }
}
exports.PackageManager = PackageManager;

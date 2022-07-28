"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.MessageCreator = void 0;
const GatewayClient = __importStar(require("../GatewayApiSpec/api"));
const fs = __importStar(require("fs"));
const path = require("path");
const constants_1 = require("../Configuration/constants");
const fileUtility_1 = require("./fileUtility");
const blobUtility_1 = require("./blobUtility");
const exceptionMessages_1 = require("../Exceptions/exceptionMessages");
const xml2js_1 = __importDefault(require("xml2js"));
const adm_zip_1 = __importDefault(require("adm-zip"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class MessageCreator {
    constructor(_config, _blobUtility, _fileUtility) {
        this.config = _config;
        this.fileUtility = _fileUtility ? _fileUtility : new fileUtility_1.FileUtility();
        this.blobUtility = _blobUtility ? _blobUtility : new blobUtility_1.BlobUtility();
    }
    PopulateSessionRequestMessage() {
        return __awaiter(this, void 0, void 0, function* () {
            var request = new GatewayClient.MSEssGatewayClientContractsSessionRequestMessage;
            request.expiresAfter = this.CalculateExpiryAfterTimeFromHours();
            request.partitionCount = constants_1.Constant.GatewaySessionRequestPartitionCount;
            request.isProvisionStorage = constants_1.Constant.GatewaySessionRequestIsProvision;
            return request;
        });
    }
    CalculateExpiryAfterTimeFromHours() {
        var minutesToAdd = constants_1.Constant.GatewayBlobExpiryInHours * 60;
        var secondsToAdd = minutesToAdd * 60;
        var validityTime = new Date(secondsToAdd * 1000).toISOString().substr(11, 8);
        return validityTime;
    }
    FetchProductInfo(workFlow) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let productInfo = new GatewayClient.MSEssGatewayClientContractsReleaseProductInfo;
            if (workFlow == constants_1.Constant.MavenType.toLowerCase()) {
                console.log(constants_1.Constant.FileContentManipulationStarted);
                let pomFileLocation = this.config.PackageLocation;
                const readDirMain = yield fs.promises.readdir(pomFileLocation);
                let pomFileName = readDirMain.filter(el => path.extname(el) == constants_1.Constant.PomFileExtension);
                if (pomFileName.length == 0) {
                    throw new Error(exceptionMessages_1.ExceptionMessages.NoPOMFileExistsError + constants_1.Constant.PomFileExtension);
                }
                else {
                    console.log(constants_1.Constant.POMFileExists + pomFileName[0] + "\n");
                }
                let pomFileRaw = fs.readFileSync(path.join(pomFileLocation, pomFileName[0]), "utf8");
                const parser = new xml2js_1.default.Parser();
                parser.parseString(pomFileRaw, function (error, result) {
                    if (error === null) {
                        productInfo.name = result[constants_1.Constant.Project][constants_1.Constant.ArtifactId][0];
                        productInfo.version = result[constants_1.Constant.Project][constants_1.Constant.Version][0];
                        try {
                            productInfo.description = result[constants_1.Constant.Project][constants_1.Constant.Description][0];
                        }
                        catch (_a) {
                            console.log(constants_1.Constant.DescriptionMandatoryMessage);
                            productInfo.description = productInfo.name;
                        }
                    }
                    else {
                        return new Error(error);
                    }
                });
            }
            else {
                productInfo.description = constants_1.Constant.DefaultDescription;
                productInfo.name = constants_1.Constant.DefaultName;
                productInfo.version = constants_1.Constant.DefaultVersion;
            }
            if (productInfo.description.length >= constants_1.Constant.MaxDescriptionLength) {
                productInfo.description = (_a = productInfo.description) === null || _a === void 0 ? void 0 : _a.substring(0, constants_1.Constant.MaxDescriptionLength);
            }
            return productInfo;
        });
    }
    PopulateReleaseRequestMessage(containerSas) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            var policyFile = fs.readFileSync(path.join(__dirname, constants_1.Constant.PolicyJsonFilePath)).toString();
            let policyobject = JSON.parse(policyFile);
            var pr = fs.readFileSync(path.join(__dirname, constants_1.Constant.SubmitReleaseJsonFilePath)).toString();
            let request = JSON.parse(pr);
            request.esrpCorrelationId = this.config.RequestCorrelationId;
            request.routingInfo = policyobject;
            request.routingInfo.contentType = this.config.ContentType.toLowerCase();
            request.routingInfo.intent = this.config.Intent.toLowerCase();
            request.routingInfo.audience = (_a = this.config.Audience) === null || _a === void 0 ? void 0 : _a.toLowerCase();
            request.routingInfo.contentOrigin = (_b = this.config.ContentOrigin) === null || _b === void 0 ? void 0 : _b.toLowerCase();
            request.routingInfo.productState = (_c = this.config.ProductState) === null || _c === void 0 ? void 0 : _c.toLowerCase();
            request.releaseInfo.properties.releaseContentType = this.config.ContentType.toLowerCase();
            let productInfo = yield this.FetchProductInfo(this.config.ContentType.toLowerCase()).then();
            request.productInfo = productInfo;
            request.releaseInfo.title = productInfo.name;
            var allOwnersEmail = this.config.Owners.split(constants_1.Constant.Comma);
            allOwnersEmail.forEach(ownerEmail => {
                var _a;
                var userInfo = new GatewayClient.MSEssGatewayClientContractsReleaseUserInfo;
                userInfo.userPrincipalName = ownerEmail;
                var ownerInfo = new GatewayClient.MSEssGatewayClientContractsReleaseOwnerInfo;
                ownerInfo.owner = userInfo;
                (_a = request.owners) === null || _a === void 0 ? void 0 : _a.push(ownerInfo);
            });
            var allApprovalsEmail = this.config.Approvers.split(constants_1.Constant.Comma);
            allApprovalsEmail.forEach(approvalEmail => {
                var _a;
                var userInfo = new GatewayClient.MSEssGatewayClientContractsReleaseUserInfo;
                userInfo.userPrincipalName = approvalEmail;
                var approvalInfo = new GatewayClient.MSEssGatewayClientContractsReleaseApproverInfo;
                approvalInfo.approver = userInfo;
                approvalInfo.isAutoApproved = constants_1.Constant.DefaultIsAutoApprovedValue;
                approvalInfo.isMandatory = constants_1.Constant.DefaultIsMandatoryApprovalValue;
                (_a = request.approvers) === null || _a === void 0 ? void 0 : _a.push(approvalInfo);
            });
            request.accessPermissionsInfo.mainPublisher = this.config.MainPublisher;
            request.createdBy.userPrincipalName = (_d = (request.owners)[0].owner) === null || _d === void 0 ? void 0 : _d.userPrincipalName;
            var localFileLocation = this.config.PackageLocation;
            const zipFileCreator = new adm_zip_1.default();
            zipFileCreator.addLocalFolder(localFileLocation);
            let targetFileName = productInfo.name + "-" + productInfo.version + constants_1.Constant.ZipExtension;
            let targetFileLocation = path.join(localFileLocation, targetFileName);
            zipFileCreator.writeZip(targetFileLocation);
            var fileInfo = new GatewayClient.MSEssGatewayClientContractsReleaseReleaseFileInfo;
            fileInfo.sourceLocation = new GatewayClient.MSEssGatewayClientContractsFileLocation;
            fileInfo.hashType = GatewayClient.MSEssGatewayClientContractsReleaseReleaseFileInfo.HashTypeEnum.Sha256;
            fileInfo.hash = this.fileUtility.getFile256HashInBase64(targetFileLocation);
            fileInfo.sizeInBytes = this.fileUtility.getFileSizeInBytes(targetFileLocation);
            fileInfo.tenantFileLocationType = constants_1.Constant.LocationTypeUNC;
            fileInfo.tenantFileLocation = localFileLocation;
            fileInfo.sourceLocation.type = GatewayClient.MSEssGatewayClientContractsFileLocation.TypeEnum.AzureBlob;
            let blobSas;
            yield this.blobUtility.uploadFileAndGetSas(containerSas, targetFileName, targetFileLocation).then((response) => {
                blobSas = response;
            }).catch((error) => {
                console.log(exceptionMessages_1.ExceptionMessages.FileUploadingAndBlobSASGeneratingError);
                throw error;
            });
            fileInfo.sourceLocation.blobUrl = blobSas.toString();
            fileInfo.name = productInfo.name;
            fileInfo.friendlyFileName = targetFileName;
            (_e = request.files) === null || _e === void 0 ? void 0 : _e.push(fileInfo);
            let crit = constants_1.Constant.TokenHeaderValidationCriteria.split(constants_1.Constant.Comma);
            let tokenValidityTicks = this.CalculateTokenExpiryInTicksFromHours();
            const jWtHeader = {
                alg: constants_1.Constant.RSA256Algorithm,
                x5t: this.config.SignCertThumbprint,
                crit: crit,
                exp: tokenValidityTicks,
                x5c: this.config.SignPublicCert
            };
            let signingOptions = {
                algorithm: 'RS256',
                expiresIn: constants_1.Constant.JWTTokenExpiryOneHour,
                header: jWtHeader
            };
            const myToken = jsonwebtoken_1.default.sign(request, this.config.SignPrivateKey, signingOptions);
            request.jwsToken = myToken;
            return request;
        });
    }
    CalculateTokenExpiryInTicksFromHours() {
        const ticksTillDateBaseline = constants_1.Constant.TicksTill111997; // ticks till 01/01/1970
        var minutesToAdd = constants_1.Constant.TokenExpiryInHours * 60;
        var tokenValidityDateTime = new Date(Date.now() + minutesToAdd * 60000);
        var tokenValidityNanoseconds = Date.parse(tokenValidityDateTime.toString()) * 10000;
        var tokenValidityTicks = tokenValidityNanoseconds + ticksTillDateBaseline;
        return tokenValidityTicks;
    }
}
exports.MessageCreator = MessageCreator;
class JwtHeaderClass {
}

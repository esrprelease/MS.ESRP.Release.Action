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
exports.GatewayCaller = void 0;
const GatewayClient = __importStar(require("../../Ms.Ess.Release.Task.Common/GatewayApiSpec/api"));
const delay_1 = __importDefault(require("delay"));
const authContextManager_1 = require("../Managers/authContextManager");
const constants_1 = require("../../Ms.Ess.Release.Task.Common/Configuration/constants");
const messageCreator_1 = require("../../Ms.Ess.Release.Task.Common/Utilities/messageCreator");
const exceptionMessages_1 = require("../../Ms.Ess.Release.Task.Common/Exceptions/exceptionMessages");
class GatewayCaller {
    constructor(_config, _authContext, _messageCreator) {
        this.config = _config;
        this.authContext = _authContext ? _authContext : new authContextManager_1.AuthenticationManager(this.config);
        this.messageCreator = _messageCreator ? _messageCreator : new messageCreator_1.MessageCreator(this.config);
    }
    GatewayCalling() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield this.FillAccessToken().then();
            var containerSas = yield this.FetchContainerSas().then();
            var oAuth = new GatewayClient.OAuth();
            oAuth.accessToken = (_a = this.authContext) === null || _a === void 0 ? void 0 : _a.accessToken;
            var releaseApi = new GatewayClient.ReleaseApi();
            releaseApi.setDefaultAuthentication(oAuth);
            releaseApi.basePath = this.config.ServiceEndpointUrl;
            var request = new GatewayClient.MSEssGatewayClientContractsReleaseRequestReleaseRequestMessage;
            request = yield this.messageCreator.PopulateReleaseRequestMessage(containerSas).then();
            console.log(constants_1.Constant.GatewayRequestMessage);
            request.version = constants_1.Constant.VersionNumber2;
            var operationResponse = yield releaseApi.releasePostRelease2Async(this.config.ClientId, constants_1.Constant.VersionNumber2, request);
            var operationId = operationResponse.body.operationId;
            console.log(constants_1.Constant.GatewayResponseMessage + operationId + '\n');
            return operationId;
        });
    }
    GatewayPolling(operationId) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            var oAuth = new GatewayClient.OAuth();
            oAuth.accessToken = (_a = this.authContext) === null || _a === void 0 ? void 0 : _a.accessToken;
            var releaseApi = new GatewayClient.ReleaseApi();
            releaseApi.setDefaultAuthentication(oAuth);
            releaseApi.basePath = this.config.ServiceEndpointUrl;
            while (true) {
                console.log(constants_1.Constant.ReleaseDetailsFetchingMessage);
                var releaseResponse = yield releaseApi.releaseGetReleaseDetailsByReleaseIdAsync(operationId === null || operationId === void 0 ? void 0 : operationId.toString(), this.config.ClientId, constants_1.Constant.VersionNumber2);
                var responseStatus = releaseResponse.body.status;
                if (this.IsTerminalReached(responseStatus) == true) {
                    console.log(operationId + constants_1.Constant.HasReachedTerminalState + (responseStatus === null || responseStatus === void 0 ? void 0 : responseStatus.toString()) + '\n');
                    if (responseStatus != GatewayClient.MSEssGatewayClientContractsReleaseResponseReleaseDetailsMessage.StatusEnum.Pass) {
                        throw new Error(exceptionMessages_1.ExceptionMessages.OperationIdStatusNotSuccess +
                            "ErrorMessage : " + ((_b = releaseResponse.body.releaseError) === null || _b === void 0 ? void 0 : _b.errorMessages)
                            + ", ErrorCode : " + ((_c = releaseResponse.body.releaseError) === null || _c === void 0 ? void 0 : _c.errorCode));
                    }
                    break;
                }
                console.log(operationId + constants_1.Constant.Status + responseStatus + '\n');
                console.log(constants_1.Constant.ReleaseUIAccessMessage + operationId + '\n');
                yield (0, delay_1.default)(this.config.StatusPollingInterval);
            }
        });
    }
    IsTerminalReached(responseStatus) {
        if (responseStatus == GatewayClient.MSEssGatewayClientContractsReleaseResponseReleaseDetailsMessage.StatusEnum.Pass
            || responseStatus == GatewayClient.MSEssGatewayClientContractsReleaseResponseReleaseDetailsMessage.StatusEnum.Cancelled
            || responseStatus == GatewayClient.MSEssGatewayClientContractsReleaseResponseReleaseDetailsMessage.StatusEnum.FailCanRetry
            || responseStatus == GatewayClient.MSEssGatewayClientContractsReleaseResponseReleaseDetailsMessage.StatusEnum.FailDoNotRetry) {
            return true;
        }
        else {
            return false;
        }
    }
    FillAccessToken() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (((_a = this.authContext) === null || _a === void 0 ? void 0 : _a.accessToken) == undefined) {
                yield this.authContext.setAccessToken().catch((error) => {
                    throw error;
                });
            }
        });
    }
    FetchContainerSas() {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            yield this.FillAccessToken().then();
            var oAath = new GatewayClient.OAuth();
            oAath.accessToken = (_a = this.authContext) === null || _a === void 0 ? void 0 : _a.accessToken;
            var sessionApi = new GatewayClient.SessionApi();
            sessionApi.setDefaultAuthentication(oAath);
            sessionApi.basePath = this.config.ServiceEndpointUrl;
            var request = new GatewayClient.MSEssGatewayClientContractsSessionRequestMessage;
            request = yield this.messageCreator.PopulateSessionRequestMessage().then();
            console.log(constants_1.Constant.GatewaySessionRequestMessageSend);
            var operationResponse = yield sessionApi.sessionCreateSessionAsync(this.config.ClientId, constants_1.Constant.VersionNumber2, request);
            var sessionResponseShards = (_c = (_b = operationResponse === null || operationResponse === void 0 ? void 0 : operationResponse.body) === null || _b === void 0 ? void 0 : _b.storageResult) === null || _c === void 0 ? void 0 : _c.storageShards;
            let containerSaS = new URL((_d = sessionResponseShards[0].shardLocation) === null || _d === void 0 ? void 0 : _d.bloburl);
            console.log(constants_1.Constant.GatewaySessionsShardsReceived);
            return containerSaS;
        });
    }
}
exports.GatewayCaller = GatewayCaller;

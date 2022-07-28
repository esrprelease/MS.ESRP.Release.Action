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
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const core = __importStar(require("@actions/core"));
const api_1 = require("./Ms.Ess.Release.Task.Common/GatewayApiSpec/api");
const constants_1 = require("./Ms.Ess.Release.Task.Common/Configuration/constants");
const trackingMessages_1 = require("./Ms.Ess.Release.Task.Common/Logging/trackingMessages");
const exceptionMessages_1 = require("./Ms.Ess.Release.Task.Common/Exceptions/exceptionMessages");
const configValidators_1 = require("./Ms.Ess.Release.Task.Core/Validators/configValidators");
const gatewayCaller_1 = require("./Ms.Ess.Release.Task.Core/Executers/gatewayCaller");
const applicationInsights_1 = require("./Ms.Ess.Release.Task.Common/Logging/applicationInsights");
const configManager_1 = require("./Ms.Ess.Release.Task.Core/Managers/configManager");
const packageManager_1 = require("./Ms.Ess.Release.Task.Core/Managers/packageManager");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let appInsightsKey = constants_1.Constant.AppInsightsLoggingKey;
            var applicationInsights = applicationInsights_1.ApplicationInsights.CreateInstance(appInsightsKey);
            var configManager = new configManager_1.ConfigManager();
            yield configManager.PopulateConfiguration().then(() => {
                console.log(constants_1.Constant.ConfigPopulatingSuccess);
                applicationInsights === null || applicationInsights === void 0 ? void 0 : applicationInsights.LogTrace(configManager.config.RequestCorrelationId, trackingMessages_1.TrackingMessages.ConfigUpdateSuccess, trackingMessages_1.TrackingMessages.ActionFile);
            }).catch((error) => {
                console.log(exceptionMessages_1.ExceptionMessages.ConfigCreationFailed);
                applicationInsights === null || applicationInsights === void 0 ? void 0 : applicationInsights.LogException(configManager.config.RequestCorrelationId, trackingMessages_1.TrackingMessages.ConfigUpdateException, error, trackingMessages_1.TrackingMessages.ActionFile);
                throw error;
            });
            var validator = new configValidators_1.Validator();
            yield validator.ValidateConfig(configManager.config).then((response) => {
                if (response == true) {
                    console.log(constants_1.Constant.ConfigValidationSuccess);
                    applicationInsights === null || applicationInsights === void 0 ? void 0 : applicationInsights.LogTrace(configManager.config.RequestCorrelationId, trackingMessages_1.TrackingMessages.ConfigValidationSuccess, trackingMessages_1.TrackingMessages.ActionFile);
                }
            }).catch((error) => {
                console.log(exceptionMessages_1.ExceptionMessages.ConfigValidationFailed);
                applicationInsights === null || applicationInsights === void 0 ? void 0 : applicationInsights.LogException(configManager.config.RequestCorrelationId, trackingMessages_1.TrackingMessages.ConfigValidationException, error, trackingMessages_1.TrackingMessages.ActionFile);
                throw error;
            });
            var gatewayCommunicator = new gatewayCaller_1.GatewayCaller(configManager.config);
            let operationId = "";
            yield gatewayCommunicator.GatewayCalling().then((responseId) => {
                operationId = responseId;
            }).catch((error) => {
                console.log(exceptionMessages_1.ExceptionMessages.GatewayCallingExecutionFailed);
                applicationInsights === null || applicationInsights === void 0 ? void 0 : applicationInsights.LogException(configManager.config.RequestCorrelationId, trackingMessages_1.TrackingMessages.GatewayCallingExecutionException, error, trackingMessages_1.TrackingMessages.ActionFile);
                var finalError = new Error();
                try {
                    let err = error;
                    finalError = new Error(err.response.statusCode + '--' + err.response.statusMessage);
                }
                catch (er) {
                    throw error;
                }
                throw finalError;
            });
            yield gatewayCommunicator.GatewayPolling(operationId).then().catch((error) => {
                console.log(exceptionMessages_1.ExceptionMessages.GatewayPollingExecutionFailed);
                applicationInsights === null || applicationInsights === void 0 ? void 0 : applicationInsights.LogException(configManager.config.RequestCorrelationId, trackingMessages_1.TrackingMessages.GatewayPollingExecutionException, error, trackingMessages_1.TrackingMessages.ActionFile);
                var finalError = new Error();
                try {
                    let err = error;
                    finalError = new Error(err.response.statusCode + '--' + err.response.statusMessage);
                }
                catch (er) {
                    throw error;
                }
                throw finalError;
            });
            console.log(constants_1.Constant.HappyPathSuccessExecutionMessage);
            if (configManager.config.MavenCheck == constants_1.Constant.MavenCheck && api_1.MSEssGatewayClientContractsReleaseResponseReleaseDetailsMessage.StatusEnum.Pass) {
                var packageManager = new packageManager_1.PackageManager(configManager.config);
                yield packageManager.PopulatePackageDetail().then(() => {
                    console.log(constants_1.Constant.PackageDetails);
                }).catch((error) => {
                    console.log(error);
                });
            }
        }
        catch (error) {
            console.log(exceptionMessages_1.ExceptionMessages.ExecutionFailed);
            console.log('CorrelationId: ' + configManager.config.RequestCorrelationId);
            try {
                let err = error;
                console.log(err.message);
            }
            catch (er) {
                console.log(error);
            }
            core.setFailed(constants_1.Constant.FailurePathExecutionMessage);
        }
    });
}
exports.run = run;
run();

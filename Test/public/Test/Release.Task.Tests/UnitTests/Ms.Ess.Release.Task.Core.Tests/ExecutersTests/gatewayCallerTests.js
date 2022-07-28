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
const assert_1 = __importDefault(require("assert"));
const path_1 = __importDefault(require("path"));
const exceptionMessages_1 = require("../../../../../Task/Ms.Ess.Release.Task.Common/Exceptions/exceptionMessages");
const configManager_1 = require("../../../../../Task/Ms.Ess.Release.Task.Core/Managers/configManager");
const gatewayCaller_1 = require("../../../../../Task/Ms.Ess.Release.Task.Core/Executers/gatewayCaller");
const testConstant_1 = require("../../../testConstant");
describe('gatewayCallerTest', function () {
    this.timeout(0);
    var config;
    var zipFileRelativeLocation;
    var zipFileLocation;
    this.beforeAll(() => __awaiter(this, void 0, void 0, function* () {
        var configManager = new configManager_1.ConfigManager();
        yield configManager.PopulateConfiguration().then();
        config = configManager.config;
        zipFileRelativeLocation = testConstant_1.TestConstants.ZipFileRelativePathWrtTaskCoreTests;
        zipFileLocation = getZipFileAbsoluteLocation(zipFileRelativeLocation);
    }));
    it('gatewayCallerSuccessTest', function () {
        return __awaiter(this, void 0, void 0, function* () {
            var gatewayCaller = new gatewayCaller_1.GatewayCaller(config);
            setValidConfigParameters(config);
            let operationId = "";
            yield gatewayCaller.GatewayCalling().then((responseId) => {
                operationId = responseId;
            }).catch((error) => {
                assert_1.default.fail(exceptionMessages_1.ExceptionMessages.GatewayCallingExecutionFailed + error);
            });
            yield gatewayCaller.GatewayPolling(operationId).catch((error) => {
                assert_1.default.fail(exceptionMessages_1.ExceptionMessages.GatewayPollingExecutionFailed + error);
            });
        });
    });
    it('gatewayCallerPomFileDescriptionNotPresentSuccessTest', function () {
        return __awaiter(this, void 0, void 0, function* () {
            var gatewayCaller = new gatewayCaller_1.GatewayCaller(config);
            setPathPomFileWithNoDescriptionValidConfigParameters(config);
            let operationId = "";
            yield gatewayCaller.GatewayCalling().then((responseId) => {
                operationId = responseId;
            }).catch((error) => {
                assert_1.default.fail(exceptionMessages_1.ExceptionMessages.GatewayCallingExecutionFailed + error);
            });
            yield gatewayCaller.GatewayPolling(operationId).catch((error) => {
                assert_1.default.fail(exceptionMessages_1.ExceptionMessages.GatewayPollingExecutionFailed + error);
            });
        });
    });
    function setValidConfigParameters(config) {
        config.PackageLocation = zipFileLocation;
    }
    function setPathPomFileWithNoDescriptionValidConfigParameters(config) {
        config.PackageLocation = zipFileLocation + "-PomFileNodescription";
    }
    function getZipFileAbsoluteLocation(zipFileRelativeLocation) {
        let fileFolderLocation = path_1.default.join(__dirname, zipFileRelativeLocation);
        return fileFolderLocation;
    }
});

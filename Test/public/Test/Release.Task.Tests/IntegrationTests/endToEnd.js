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
const gatewayCaller_1 = require("../../../Task/Ms.Ess.Release.Task.Core/Executers/gatewayCaller");
const configManager_1 = require("../../../Task/Ms.Ess.Release.Task.Core/Managers/configManager");
const configValidators_1 = require("../../../Task/Ms.Ess.Release.Task.Core/Validators/configValidators");
const testConstant_1 = require("../testConstant");
const path = require("path");
const sinon_1 = __importDefault(require("sinon"));
const tmrm = require("azure-pipelines-task-lib/mock-run");
describe('integrationTests', function () {
    this.timeout(0);
    var indexFileRelativePath;
    this.beforeAll(() => __awaiter(this, void 0, void 0, function* () {
        indexFileRelativePath = testConstant_1.TestConstants.IndexFileRelativePathWrtITests;
    }));
    it('integrationTestsSuccessTest', function () {
        return __awaiter(this, void 0, void 0, function* () {
            let taskPath = path.join(__dirname, indexFileRelativePath);
            let tmr = new tmrm.TaskMockRunner(taskPath);
            let spyValidation = sinon_1.default.spy(configValidators_1.Validator.prototype, "ValidateConfig");
            let spyConfiguration = sinon_1.default.spy(configManager_1.ConfigManager.prototype, "PopulateConfiguration");
            let spyGatewayCaller = sinon_1.default.spy(gatewayCaller_1.GatewayCaller.prototype, "GatewayCalling");
            let spyGatewayPoller = sinon_1.default.spy(gatewayCaller_1.GatewayCaller.prototype, "GatewayPolling");
            let spyGatewayCallerResponse = sinon_1.default.spy(gatewayCaller_1.GatewayCaller.prototype, "IsTerminalReached");
            tmr.run();
            yield sleep(50000);
            sinon_1.default.assert.calledOnce(spyValidation);
            sinon_1.default.assert.calledOnce(spyConfiguration);
            sinon_1.default.assert.calledOnce(spyGatewayCaller);
            sinon_1.default.assert.calledOnce(spyGatewayPoller);
            sinon_1.default.assert.calledOnce(spyGatewayCallerResponse);
            spyValidation.calledAfter(spyConfiguration);
            spyGatewayCaller.calledAfter(spyValidation);
            spyGatewayPoller.calledAfter(spyGatewayCaller);
        });
    });
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
});

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
const configManager_1 = require("../../../../../Task/Ms.Ess.Release.Task.Core/Managers/configManager");
const testConstant_1 = require("../../../testConstant");
const uuid_1 = require("uuid");
const applicationInsights_1 = require("../../../../../Task/Ms.Ess.Release.Task.Common/Logging/applicationInsights");
describe('applicationInsightsTest', function () {
    this.timeout(0);
    var config;
    let sampleEvent;
    let sampleException;
    let sampleMessageTrace;
    this.beforeEach(() => __awaiter(this, void 0, void 0, function* () {
        applicationInsights_1.ApplicationInsights.instance = undefined;
    }));
    this.beforeAll(() => __awaiter(this, void 0, void 0, function* () {
        var configManager = new configManager_1.ConfigManager();
        yield configManager.PopulateConfiguration().then();
        config = configManager.config;
        sampleEvent = testConstant_1.TestConstants.SampleEvent;
        sampleException = testConstant_1.TestConstants.SampleException;
        sampleMessageTrace = testConstant_1.TestConstants.SampleMessageTrace;
    }));
    it('applicationInsightsSuccessTest', function () {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var applicationInsights = applicationInsights_1.ApplicationInsights.CreateInstance(config === null || config === void 0 ? void 0 : config.AppInsightsLoggingKey);
                let sampleCorrelationId = (0, uuid_1.v4)();
                applicationInsights.LogEvent(sampleCorrelationId, sampleEvent);
                applicationInsights.LogException(sampleCorrelationId, sampleException);
                applicationInsights.LogTrace(sampleCorrelationId, sampleMessageTrace);
            }
            catch (error) {
                assert_1.default.fail(error);
            }
        });
    });
    it('applicationInsightsValidateSingletonPropertyBothPassingKeySuccessTest', function () {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var applicationInsights1 = applicationInsights_1.ApplicationInsights.CreateInstance(config === null || config === void 0 ? void 0 : config.AppInsightsLoggingKey);
                let firstTimeIsEnabled = applicationInsights1.isEnabled;
                var applicationInsights2 = applicationInsights_1.ApplicationInsights.CreateInstance(config === null || config === void 0 ? void 0 : config.AppInsightsLoggingKey);
                let secondTimeIsEnabled = applicationInsights2.isEnabled;
                assert_1.default.equal(applicationInsights1, applicationInsights2);
                assert_1.default.equal(firstTimeIsEnabled, true);
                assert_1.default.equal(secondTimeIsEnabled, true);
            }
            catch (error) {
                assert_1.default.fail(error);
            }
        });
    });
    it('applicationInsightsValidateSingletonPropertyNonePassingKeySuccessTest', function () {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var applicationInsights1 = applicationInsights_1.ApplicationInsights.CreateInstance();
                let firstTimeIsEnabled = applicationInsights1 === null || applicationInsights1 === void 0 ? void 0 : applicationInsights1.isEnabled;
                var applicationInsights2 = applicationInsights_1.ApplicationInsights.CreateInstance();
                let secondTimeIsEnabled = applicationInsights2 === null || applicationInsights2 === void 0 ? void 0 : applicationInsights2.isEnabled;
                assert_1.default.equal(applicationInsights1, applicationInsights2);
                assert_1.default.equal(firstTimeIsEnabled, undefined);
                assert_1.default.equal(secondTimeIsEnabled, undefined);
            }
            catch (error) {
                assert_1.default.fail(error);
            }
        });
    });
    it('applicationInsightsValidateSingletonPropertyOnlyFirstPassingKeySuccessTest', function () {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var applicationInsights1 = applicationInsights_1.ApplicationInsights.CreateInstance(config === null || config === void 0 ? void 0 : config.AppInsightsLoggingKey);
                let firstTimeIsEnabled = applicationInsights1.isEnabled;
                var applicationInsights2 = applicationInsights_1.ApplicationInsights.CreateInstance();
                let secondTimeIsEnabled = applicationInsights2 === null || applicationInsights2 === void 0 ? void 0 : applicationInsights2.isEnabled;
                assert_1.default.equal(applicationInsights1, applicationInsights2);
                assert_1.default.equal(firstTimeIsEnabled, true);
                assert_1.default.equal(secondTimeIsEnabled, true);
            }
            catch (error) {
                assert_1.default.fail(error);
            }
        });
    });
    it('applicationInsightsValidateSingletonPropertyOnlySecondPassingKeySuccessTest', function () {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var applicationInsights1 = applicationInsights_1.ApplicationInsights.CreateInstance();
                let firstTimeIsEnabled = applicationInsights1 === null || applicationInsights1 === void 0 ? void 0 : applicationInsights1.isEnabled;
                var applicationInsights2 = applicationInsights_1.ApplicationInsights.CreateInstance(config === null || config === void 0 ? void 0 : config.AppInsightsLoggingKey);
                let secondTimeIsEnabled = applicationInsights2 === null || applicationInsights2 === void 0 ? void 0 : applicationInsights2.isEnabled;
                assert_1.default.notEqual(applicationInsights1, applicationInsights2);
                assert_1.default.equal(applicationInsights1, undefined);
                assert_1.default.equal(firstTimeIsEnabled, undefined);
                assert_1.default.equal(secondTimeIsEnabled, true);
            }
            catch (error) {
                assert_1.default.fail(error);
            }
        });
    });
});

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
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const exceptionMessages_1 = require("../../../../../Task/Ms.Ess.Release.Task.Common/Exceptions/exceptionMessages");
const configManager_1 = require("../../../../../Task/Ms.Ess.Release.Task.Core/Managers/configManager");
const configValidators_1 = require("../../../../../Task/Ms.Ess.Release.Task.Core/Validators/configValidators");
const testConstant_1 = require("../../../testConstant");
const configKeys_1 = require("../../../../../Task/Ms.Ess.Release.Task.Common/Configuration/configKeys");
describe('configValidatortest', function () {
    this.timeout(0);
    var config;
    var validator;
    this.beforeAll(() => __awaiter(this, void 0, void 0, function* () {
        var configManager = new configManager_1.ConfigManager;
        yield configManager.PopulateConfiguration().then();
        config = configManager.config;
        validator = new configValidators_1.Validator;
    }));
    it('configValidatorSuccessTest', function () {
        return __awaiter(this, void 0, void 0, function* () {
            setValidConfigParameters(config);
            yield validator.ValidateConfig(config).then((response) => {
                assert.equal(response, true);
            }).catch((error) => {
                assert.fail(exceptionMessages_1.ExceptionMessages.ConfigValidationFailed + error);
            });
        });
    });
    it('configValidatorClientIdMissingFailureTest', function () {
        return __awaiter(this, void 0, void 0, function* () {
            setInValidConfigParameters(config);
            yield validator.ValidateConfig(config).then((response) => {
                assert.fail();
            }).catch((error) => {
                let aggregatedError = error;
                let actualErrorName = (aggregatedError.filter(x => x.message.includes(configKeys_1.ConfigKeys.ClientId)))[0].message;
                assert.equal(actualErrorName, configKeys_1.ConfigKeys.ClientId + exceptionMessages_1.ExceptionMessages.IsNull);
            });
        });
    });
    function setValidConfigParameters(config) {
        config.ClientId = testConstant_1.TestConstants.TestClientId;
    }
    function setInValidConfigParameters(config) {
        config.ClientId = undefined;
    }
});

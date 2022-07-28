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
const configManager_1 = require("../../../../../Task/Ms.Ess.Release.Task.Core/Managers/configManager");
const authContextManager_1 = require("../../../../../Task/Ms.Ess.Release.Task.Core/Managers/authContextManager");
const assert = require("assert");
const constants_1 = require("../../../../../Task/Ms.Ess.Release.Task.Common/Configuration/constants");
const exceptionMessages_1 = require("../../../../../Task/Ms.Ess.Release.Task.Common/Exceptions/exceptionMessages");
describe('authContextManagerTest', function () {
    this.timeout(0);
    var config;
    this.beforeAll(() => __awaiter(this, void 0, void 0, function* () {
        var configManager = new configManager_1.ConfigManager();
        yield configManager.PopulateConfiguration().then();
        config = configManager.config;
    }));
    it('authContextManagerSuccessTest', function () {
        return __awaiter(this, void 0, void 0, function* () {
            var authenticationManager = new authContextManager_1.AuthenticationManager(config);
            yield authenticationManager.setAccessToken().then((response) => {
                assert.equal(constants_1.Constant.Success, response);
                assert.notEqual(null, authenticationManager.accessToken);
                assert.notEqual(undefined, authenticationManager.accessToken);
            }).catch((error) => {
                assert.fail(exceptionMessages_1.ExceptionMessages.TokenAcquiringError + error);
            });
        });
    });
});

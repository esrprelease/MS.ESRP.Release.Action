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
describe('configManagerTest', function () {
    this.timeout(0);
    it('configManagerSuccessTest', function () {
        return __awaiter(this, void 0, void 0, function* () {
            var configManager = new configManager_1.ConfigManager();
            yield configManager.PopulateConfiguration().catch((error) => {
                assert.fail(exceptionMessages_1.ExceptionMessages.ConfigCreationFailed + error);
            });
        });
    });
});

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
const sinon_1 = __importDefault(require("sinon"));
const BlobUtility = require("../../../../../Task/Ms.Ess.Release.Task.Common/Utilities/blobUtility");
const messageCreator_1 = require("../../../../../Task/Ms.Ess.Release.Task.Common/Utilities/messageCreator");
const configManager_1 = require("../../../../../Task/Ms.Ess.Release.Task.Core/Managers/configManager");
const testConstant_1 = require("../../../testConstant");
describe('messageCreatorTest', function () {
    this.timeout(0);
    var config;
    var messageCreator;
    let containerSas;
    let blobSas;
    let expiryForGatewayBlob;
    this.beforeAll(() => __awaiter(this, void 0, void 0, function* () {
        var configManager = new configManager_1.ConfigManager();
        yield configManager.PopulateConfiguration().then();
        config = configManager.config;
        messageCreator = new messageCreator_1.MessageCreator(config);
        containerSas = new URL(testConstant_1.TestConstants.ContainerSas);
        blobSas = new URL(testConstant_1.TestConstants.BlobSas);
        expiryForGatewayBlob = testConstant_1.TestConstants.ExpiryForGatewayBlob;
        stubBlobUtility();
    }));
    it('messageCreatorPopulateSessionRequestSuccessTest', function () {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const request = yield messageCreator.PopulateSessionRequestMessage();
                assert_1.default.equal(request.isProvisionStorage, true);
                assert_1.default.equal(request.expiresAfter, expiryForGatewayBlob);
            }
            catch (error) {
                assert_1.default.fail(error);
            }
        });
    });
    it('messageCreatorPopulateReleaseRequestSuccessTest', function () {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const request = yield messageCreator.PopulateReleaseRequestMessage(containerSas);
                assert_1.default.equal(true, (_a = config.Approvers) === null || _a === void 0 ? void 0 : _a.includes(request.approvers[0].approver.userPrincipalName));
                assert_1.default.equal((_b = request.files) === null || _b === void 0 ? void 0 : _b.length, 1);
            }
            catch (error) {
                assert_1.default.fail(error);
            }
        });
    });
    it('messageCreatorPopulateReleasePOMFileDescriptionNotAvailableRequestSuccessTest', function () {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                config.PackageLocation = config.PackageLocation + "-PomFileNodescription";
                const request = yield messageCreator.PopulateReleaseRequestMessage(containerSas);
                assert_1.default.equal(true, (_a = config.Approvers) === null || _a === void 0 ? void 0 : _a.includes(request.approvers[0].approver.userPrincipalName));
                assert_1.default.equal((_b = request.files) === null || _b === void 0 ? void 0 : _b.length, 1);
            }
            catch (error) {
                assert_1.default.fail(error);
            }
        });
    });
    function stubBlobUtility() {
        var stubBlobUtility = sinon_1.default.stub(BlobUtility.BlobUtility);
        sinon_1.default.stub(stubBlobUtility.prototype, "uploadFileAndGetSas").resolves(blobSas);
    }
});

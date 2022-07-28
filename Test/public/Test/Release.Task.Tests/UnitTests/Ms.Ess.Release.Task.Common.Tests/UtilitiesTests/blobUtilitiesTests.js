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
const blobUtility_1 = require("../../../../../Task/Ms.Ess.Release.Task.Common/Utilities/blobUtility");
const testConstant_1 = require("../../../testConstant");
const sinon = require("sinon");
const BlobStorageClient = require("@azure/storage-blob");
describe('buildTest', function () {
    describe('blobUtilityTest', function () {
        this.timeout(0);
        var blobUtility;
        let containerSas;
        let blobFileName;
        let zipFileLocation;
        let zipFileRelativePath;
        this.beforeAll(() => __awaiter(this, void 0, void 0, function* () {
            blobUtility = new blobUtility_1.BlobUtility();
            containerSas = new URL(testConstant_1.TestConstants.ContainerSas);
            blobFileName = testConstant_1.TestConstants.BlobFileName;
            zipFileRelativePath = testConstant_1.TestConstants.ZipFileRelativePathWrtTaskCommonTests;
            zipFileLocation = getZipFileLocation();
        }));
        it('blobUtilityUploadSuccessTest', function () {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    var containerClient = new BlobStorageClient.ContainerClient(containerSas.toString());
                    var blockBlobClient = containerClient.getBlockBlobClient(blobFileName);
                    let stubContainerClient = sinon.stub(containerClient);
                    var stubBlockBlobClient = sinon.stub(blockBlobClient);
                    stubContainerClient.getBlockBlobClient.returns(stubBlockBlobClient);
                    sinon.stub(BlobStorageClient, "ContainerClient").returns(stubContainerClient);
                    yield blobUtility.uploadFileAndGetSas(containerSas, blobFileName, zipFileLocation).then((response) => {
                        assert_1.default.equal(true, (response.pathname.toString()).includes(containerClient.containerName + "/" + blockBlobClient.name));
                    }).catch((error) => {
                        throw error;
                    });
                }
                catch (error) {
                    assert_1.default.fail(error);
                }
            });
        });
        function getZipFileLocation() {
            let fileFolderLocation = path_1.default.join(__dirname, zipFileRelativePath);
            return fileFolderLocation;
        }
    });
});

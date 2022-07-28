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
const fileUtility_1 = require("../../../../../Task/Ms.Ess.Release.Task.Common/Utilities/fileUtility");
const testConstant_1 = require("../../../testConstant");
describe('buildTest', function () {
    describe('fileUtilityTest', function () {
        this.timeout(0);
        var fileUtility;
        var validFileLocation;
        var validFileSize;
        var zipFileRelativePath;
        var inValidFileLocation;
        let noSuchFileDirectory;
        this.beforeAll(() => __awaiter(this, void 0, void 0, function* () {
            fileUtility = new fileUtility_1.FileUtility();
            validFileSize = testConstant_1.TestConstants.ValidFileSize;
            zipFileRelativePath = testConstant_1.TestConstants.ZipFileRelativePathWrtTaskCommonTests;
            validFileLocation = getZipFileLocation();
            inValidFileLocation = testConstant_1.TestConstants.InValidFileLocation;
            noSuchFileDirectory = testConstant_1.TestConstants.NoSuchFileDirectory;
        }));
        it('fileUtilityGetSHA256FileNotFoundFailureTest', function () {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    var sha256 = fileUtility.getFile256HashInBase64(inValidFileLocation);
                }
                catch (error) {
                    let err = error;
                    assert_1.default.equal(true, err.message.includes(noSuchFileDirectory));
                }
            });
        });
        it('fileUtilityGetFileSizeSuccessTest', function () {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    var fileSize = fileUtility.getFileSizeInBytes(validFileLocation);
                    assert_1.default.equal(fileSize, validFileSize);
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

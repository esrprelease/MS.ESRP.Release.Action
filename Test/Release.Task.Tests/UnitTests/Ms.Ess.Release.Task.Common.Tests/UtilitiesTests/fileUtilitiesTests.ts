import assert from "assert" 
import path from "path" 
import { FileUtility } from "../../../../../Task/Ms.Ess.Release.Task.Common/Utilities/fileUtility" 
import { TestConstants } from "../../../testConstant" 

describe('buildTest', function () {
    describe('fileUtilityTest', function () {
    
        this.timeout(0) 
        var fileUtility: FileUtility 
        var validFileLocation: string 
        var validFileSize: number 
        var zipFileRelativePath: string 
        var inValidFileLocation: string 
        let noSuchFileDirectory : string 
        this.beforeAll(async () => {

            fileUtility = new FileUtility() 
            validFileSize = TestConstants.ValidFileSize 
            zipFileRelativePath = TestConstants.ZipFileRelativePathWrtTaskCommonTests 
            validFileLocation = getZipFileLocation() 
            inValidFileLocation = TestConstants.InValidFileLocation 
            noSuchFileDirectory = TestConstants.NoSuchFileDirectory 
        }) 

        it('fileUtilityGetSHA256FileNotFoundFailureTest', async function() {

            try {

                var sha256 = fileUtility.getFile256HashInBase64(inValidFileLocation) 
            }
            catch(error) {

                let err = error as Error 
                assert.equal(true, err.message.includes(noSuchFileDirectory)) 
            }
        }) 

        it('fileUtilityGetFileSizeSuccessTest', async function() {

            try {

                var fileSize = fileUtility.getFileSizeInBytes(validFileLocation) 
                assert.equal(fileSize, validFileSize) 
            }
            catch(error) {
            
                assert.fail(error as string) 
            }
        }) 

        function getZipFileLocation() : string {

            let fileFolderLocation = path.join(__dirname, zipFileRelativePath) 
            return fileFolderLocation 
        }
    }) 
}) 
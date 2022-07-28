import assert from "assert" 
import path from "path" 
import { BlobUtility } from "../../../../../Task/Ms.Ess.Release.Task.Common/Utilities/blobUtility" 
import { TestConstants } from "../../../testConstant" 
import sinon = require('sinon')
import BlobStorageClient = require('@azure/storage-blob') 

describe('buildTest', function () {
    describe('blobUtilityTest', function () {
    
        this.timeout(0) 
        var blobUtility: BlobUtility 
        let containerSas: URL 
        let blobFileName: string 
        let zipFileLocation: string 
        let zipFileRelativePath: string 
        this.beforeAll(async () => {

            blobUtility = new BlobUtility() 
            containerSas = new URL(TestConstants.ContainerSas) 
            blobFileName = TestConstants.BlobFileName 
            zipFileRelativePath = TestConstants.ZipFileRelativePathWrtTaskCommonTests 
            zipFileLocation = getZipFileLocation() 
        }) 

        it('blobUtilityUploadSuccessTest', async function() {

            try {

                var containerClient = new BlobStorageClient.ContainerClient(containerSas!.toString()) 
                var blockBlobClient = containerClient.getBlockBlobClient(blobFileName) 
                let stubContainerClient = sinon.stub(containerClient) 
                var stubBlockBlobClient = sinon.stub(blockBlobClient) 
                stubContainerClient.getBlockBlobClient.returns(stubBlockBlobClient) 

                sinon.stub(BlobStorageClient, "ContainerClient").returns(stubContainerClient) 

                await blobUtility.uploadFileAndGetSas(containerSas, blobFileName, zipFileLocation).then((response) => {

                    assert.equal(true, (response!.pathname.toString()).includes(containerClient.containerName + "/" + blockBlobClient.name)) 
                }).catch((error) => {

                    throw error 
                }) 
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
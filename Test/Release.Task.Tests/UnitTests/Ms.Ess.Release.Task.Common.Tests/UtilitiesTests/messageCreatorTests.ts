import assert from "assert" 
import sinon from "sinon" 
import { IConfig } from "../../../../../Task/Ms.Ess.Release.Task.Common/Configuration/iConfig" 
import  BlobUtility =require( "../../../../../Task/Ms.Ess.Release.Task.Common/Utilities/blobUtility")
import { IMessageCreator } from "../../../../../Task/Ms.Ess.Release.Task.Common/Utilities/iMessageCreator" 
import { MessageCreator } from "../../../../../Task/Ms.Ess.Release.Task.Common/Utilities/messageCreator" 
import { ConfigManager } from "../../../../../Task/Ms.Ess.Release.Task.Core/Managers/configManager" 
import { TestConstants } from "../../../testConstant" 

describe('messageCreatorTest', function () {
    
    this.timeout(0) 
    var config: IConfig 
    var messageCreator: IMessageCreator 
    let containerSas: URL 
    let blobSas: URL 
    let expiryForGatewayBlob: string 
    this.beforeAll(async () => {

        var configManager = new ConfigManager() 
        await configManager.PopulateConfiguration().then() 
        config = configManager.config! 
        messageCreator = new MessageCreator(config) 
        containerSas = new URL(TestConstants.ContainerSas) 
        blobSas = new URL(TestConstants.BlobSas) 
        expiryForGatewayBlob = TestConstants.ExpiryForGatewayBlob 
        stubBlobUtility() 
    })  

    it('messageCreatorPopulateSessionRequestSuccessTest', async function() {
  
        try {

            const request = await messageCreator.PopulateSessionRequestMessage() 
            assert.equal(request.isProvisionStorage, true) 
            assert.equal(request.expiresAfter, expiryForGatewayBlob) 
        }
        catch(error) {
            
            assert.fail(error as string) 
        }
    }) 

    it('messageCreatorPopulateReleaseRequestSuccessTest', async function() {

        try {

            const request = await messageCreator.PopulateReleaseRequestMessage(containerSas) 
            assert.equal(true, config.Approvers?.includes(request.approvers![0].approver!.userPrincipalName!)) 
            assert.equal(request.files?.length, 1) 
        }
        catch(error) {

            assert.fail(error as string) 
        }
    }) 

    it('messageCreatorPopulateReleasePOMFileDescriptionNotAvailableRequestSuccessTest', async function () {

        try {

            config.PackageLocation = config.PackageLocation + "-PomFileNodescription" 
            const request = await messageCreator.PopulateReleaseRequestMessage(containerSas) 

            assert.equal(true, config.Approvers?.includes(request.approvers![0].approver!.userPrincipalName!)) 
            assert.equal(request.files?.length, 1) 
        }
        catch (error) {

            assert.fail(error as string) 
        }
    }) 

    function stubBlobUtility() {

        var stubBlobUtility = sinon.stub(BlobUtility.BlobUtility) 
        sinon.stub(stubBlobUtility.prototype, "uploadFileAndGetSas").resolves(blobSas) 
    }

}) 
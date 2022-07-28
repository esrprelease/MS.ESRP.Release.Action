import assert from "assert"
import path from "path"
import { IConfig } from "../../../../../Task/Ms.Ess.Release.Task.Common/Configuration/iConfig"
import { ExceptionMessages } from "../../../../../Task/Ms.Ess.Release.Task.Common/Exceptions/exceptionMessages"
import { ConfigManager } from "../../../../../Task/Ms.Ess.Release.Task.Core/Managers/configManager"
import {GatewayCaller} from "../../../../../Task/Ms.Ess.Release.Task.Core/Executers/gatewayCaller"
import { TestConstants } from "../../../testConstant"

describe('gatewayCallerTest', function () {
    
    this.timeout(0) 
    var config: IConfig 
    var zipFileRelativeLocation: string 
    var zipFileLocation: string 
    this.beforeAll(async () => {

        var configManager = new ConfigManager() 
        await configManager.PopulateConfiguration().then() 
        config = configManager.config! 
        zipFileRelativeLocation = TestConstants.ZipFileRelativePathWrtTaskCoreTests 
        zipFileLocation = getZipFileAbsoluteLocation(zipFileRelativeLocation) 
    }) 

    it('gatewayCallerSuccessTest', async function() {
 
        var gatewayCaller = new GatewayCaller(config!) 
        
        setValidConfigParameters(config!) 
        let operationId = "" 
        await gatewayCaller.GatewayCalling().then((responseId) => {

            operationId = responseId 
        }).catch((error) => {

            assert.fail(ExceptionMessages.GatewayCallingExecutionFailed + error as string) 
        }) 
        await gatewayCaller.GatewayPolling(operationId).catch((error) => {

            assert.fail(ExceptionMessages.GatewayPollingExecutionFailed + error as string) 
        }) 
    }) 

    it('gatewayCallerPomFileDescriptionNotPresentSuccessTest', async function () {

        var gatewayCaller = new GatewayCaller(config!) 

        setPathPomFileWithNoDescriptionValidConfigParameters(config!) 
        let operationId = "" 
        await gatewayCaller.GatewayCalling().then((responseId) => {

            operationId = responseId 
        }).catch((error) => {

            assert.fail(ExceptionMessages.GatewayCallingExecutionFailed + error as string) 
        }) 
        await gatewayCaller.GatewayPolling(operationId).catch((error) => {

            assert.fail(ExceptionMessages.GatewayPollingExecutionFailed + error as string) 
        }) 
    }) 

    function setValidConfigParameters(config: IConfig) {

        config.PackageLocation = zipFileLocation 
    }

    function setPathPomFileWithNoDescriptionValidConfigParameters(config: IConfig) {

        config.PackageLocation = zipFileLocation + "-PomFileNodescription" 
    }

    function getZipFileAbsoluteLocation(zipFileRelativeLocation: string) : string {

        let fileFolderLocation = path.join(__dirname, zipFileRelativeLocation) 
        return fileFolderLocation 
    }
}) 
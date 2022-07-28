import { GatewayCaller } from "../../../Task/Ms.Ess.Release.Task.Core/Executers/gatewayCaller" 
import { ConfigManager } from "../../../Task/Ms.Ess.Release.Task.Core/Managers/configManager" 
import { Validator } from "../../../Task/Ms.Ess.Release.Task.Core/Validators/configValidators" 
import { TestConstants } from "../testConstant" 
import path = require('path')
import sinon from 'sinon'
import tmrm = require('azure-pipelines-task-lib/mock-run')


describe('integrationTests', function () {

    this.timeout(0) 
    var indexFileRelativePath: string 
    this.beforeAll(async () => {

        indexFileRelativePath = TestConstants.IndexFileRelativePathWrtITests 
    }) 

    it('integrationTestsSuccessTest', async function () {

        let taskPath = path.join(__dirname, indexFileRelativePath) 
        let tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath) 

        let spyValidation = sinon.spy(Validator.prototype, "ValidateConfig") 
        let spyConfiguration = sinon.spy(ConfigManager.prototype, "PopulateConfiguration") 
        let spyGatewayCaller = sinon.spy(GatewayCaller.prototype, "GatewayCalling") 
        let spyGatewayPoller = sinon.spy(GatewayCaller.prototype, "GatewayPolling") 
        let spyGatewayCallerResponse = sinon.spy(GatewayCaller.prototype, "IsTerminalReached") 

        tmr.run() 
        await sleep(50000) 
        
        sinon.assert.calledOnce(spyValidation) 
        sinon.assert.calledOnce(spyConfiguration) 
        sinon.assert.calledOnce(spyGatewayCaller) 
        sinon.assert.calledOnce(spyGatewayPoller) 
        sinon.assert.calledOnce(spyGatewayCallerResponse) 
        spyValidation.calledAfter(spyConfiguration) 
        spyGatewayCaller.calledAfter(spyValidation) 
        spyGatewayPoller.calledAfter(spyGatewayCaller) 
    })   
    
    function sleep(ms: number) {

        return new Promise(resolve => setTimeout(resolve, ms)) 
    }
}) 
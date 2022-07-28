import assert from "assert" 
import { IConfig } from "../../../../../Task/Ms.Ess.Release.Task.Common/Configuration/iConfig" 
import { ConfigManager } from "../../../../../Task/Ms.Ess.Release.Task.Core/Managers/configManager" 
import { TestConstants } from "../../../testConstant" 
import {v4 as uuidv4} from 'uuid' 
import { ApplicationInsights } from "../../../../../Task/Ms.Ess.Release.Task.Common/Logging/applicationInsights"

describe('applicationInsightsTest', function () {

    this.timeout(0) 
    var config : IConfig 
    let sampleEvent: string 
    let sampleException: string 
    let sampleMessageTrace: string 
    this.beforeEach(async () => {

        ApplicationInsights.instance = undefined 
    }) 
    this.beforeAll(async () => {

        var configManager = new ConfigManager() 
        await configManager.PopulateConfiguration().then() 
        config = configManager.config! 
        sampleEvent = TestConstants.SampleEvent 
        sampleException = TestConstants.SampleException 
        sampleMessageTrace = TestConstants.SampleMessageTrace 
    }) 

    it('applicationInsightsSuccessTest', async function () {

        try {

            var applicationInsights = ApplicationInsights.CreateInstance(config?.AppInsightsLoggingKey)! 
            let sampleCorrelationId = uuidv4() 
            applicationInsights.LogEvent(sampleCorrelationId, sampleEvent) 
            applicationInsights.LogException(sampleCorrelationId, sampleException) 
            applicationInsights.LogTrace(sampleCorrelationId, sampleMessageTrace) 
        }
        catch(error) {

            assert.fail(error as string) 
        }
    }) 

    it('applicationInsightsValidateSingletonPropertyBothPassingKeySuccessTest', async function() {
 
        try {
            
            var applicationInsights1 = ApplicationInsights.CreateInstance(config?.AppInsightsLoggingKey)! 
            let firstTimeIsEnabled = applicationInsights1.isEnabled 
            var applicationInsights2 = ApplicationInsights.CreateInstance(config?.AppInsightsLoggingKey)! 
            let secondTimeIsEnabled = applicationInsights2.isEnabled 

            assert.equal(applicationInsights1, applicationInsights2) 
            assert.equal(firstTimeIsEnabled, true) 
            assert.equal(secondTimeIsEnabled, true) 
        }
        catch(error) {

            assert.fail(error as string) 
        }
    }) 

    it('applicationInsightsValidateSingletonPropertyNonePassingKeySuccessTest', async function() {

        try {

            var applicationInsights1 = ApplicationInsights.CreateInstance() 
            let firstTimeIsEnabled = applicationInsights1?.isEnabled 
            var applicationInsights2 = ApplicationInsights.CreateInstance() 
            let secondTimeIsEnabled = applicationInsights2?.isEnabled 

            assert.equal(applicationInsights1, applicationInsights2) 
            assert.equal(firstTimeIsEnabled, undefined) 
            assert.equal(secondTimeIsEnabled, undefined) 
        }
        catch(error) {

            assert.fail(error as string) 
        }
    }) 

    it('applicationInsightsValidateSingletonPropertyOnlyFirstPassingKeySuccessTest', async function() {

        try {
            
            var applicationInsights1 = ApplicationInsights.CreateInstance(config?.AppInsightsLoggingKey)! 
            let firstTimeIsEnabled = applicationInsights1.isEnabled 
            var applicationInsights2 = ApplicationInsights.CreateInstance() 
            let secondTimeIsEnabled = applicationInsights2?.isEnabled 

            assert.equal(applicationInsights1, applicationInsights2) 
            assert.equal(firstTimeIsEnabled, true) 
            assert.equal(secondTimeIsEnabled, true) 
        }
        catch(error) {

            assert.fail(error as string) 
        }
    }) 

    it('applicationInsightsValidateSingletonPropertyOnlySecondPassingKeySuccessTest', async function() {

        try {
            
            var applicationInsights1 = ApplicationInsights.CreateInstance() 
            let firstTimeIsEnabled = applicationInsights1?.isEnabled 
            var applicationInsights2 = ApplicationInsights.CreateInstance(config?.AppInsightsLoggingKey) 
            let secondTimeIsEnabled = applicationInsights2?.isEnabled 

            assert.notEqual(applicationInsights1, applicationInsights2) 
            assert.equal(applicationInsights1, undefined) 
            assert.equal(firstTimeIsEnabled, undefined) 
            assert.equal(secondTimeIsEnabled, true) 
        }
        catch(error) {

            assert.fail(error as string) 
        }
    }) 
}) 
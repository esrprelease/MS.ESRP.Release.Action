import * as core from '@actions/core'
import http = require('http') 
import { MSEssGatewayClientContractsOperationResponse, MSEssGatewayClientContractsReleaseResponseReleaseDetailsMessage } from "./Ms.Ess.Release.Task.Common/GatewayApiSpec/api" 
import { Constant } from "./Ms.Ess.Release.Task.Common/Configuration/constants" 
import { TrackingMessages } from "./Ms.Ess.Release.Task.Common/Logging/trackingMessages" 
import { ExceptionMessages } from "./Ms.Ess.Release.Task.Common/Exceptions/exceptionMessages" 
import { Validator } from "./Ms.Ess.Release.Task.Core/Validators/configValidators" 
import { GatewayCaller } from "./Ms.Ess.Release.Task.Core/Executers/gatewayCaller" 
import { ApplicationInsights } from './Ms.Ess.Release.Task.Common/Logging/applicationInsights' 
import { ConfigManager } from './Ms.Ess.Release.Task.Core/Managers/configManager' 
import { PackageManager } from './Ms.Ess.Release.Task.Core/Managers/packageManager'

export async function run(this: any) {

    try {

        let appInsightsKey = Constant.AppInsightsLoggingKey 
        var applicationInsights = ApplicationInsights.CreateInstance(appInsightsKey) 
        
        var configManager = new ConfigManager() 
        await configManager.PopulateConfiguration().then(() => {

            console.log(Constant.ConfigPopulatingSuccess) 
            applicationInsights?.LogTrace(configManager.config!.RequestCorrelationId!, TrackingMessages.ConfigUpdateSuccess, TrackingMessages.ActionFile) 
        }).catch((error) => {

            console.log(ExceptionMessages.ConfigCreationFailed) 
            applicationInsights?.LogException(configManager.config!.RequestCorrelationId!, TrackingMessages.ConfigUpdateException, error, TrackingMessages.ActionFile) 
            throw error 
        }) 
            
        var validator = new Validator() 
        await validator.ValidateConfig(configManager.config!).then((response) => {

            if(response == true) {

                console.log(Constant.ConfigValidationSuccess) 
                applicationInsights?.LogTrace(configManager.config!.RequestCorrelationId!, TrackingMessages.ConfigValidationSuccess, TrackingMessages.ActionFile) 
            }
        }).catch((error) => {

            console.log(ExceptionMessages.ConfigValidationFailed) 
            applicationInsights?.LogException(configManager.config!.RequestCorrelationId!, TrackingMessages.ConfigValidationException, error, TrackingMessages.ActionFile) 
            throw error 
        }) 

        var gatewayCommunicator = new GatewayCaller(configManager.config!) 
        let operationId = "" 
        await gatewayCommunicator.GatewayCalling().then((responseId) => {

            operationId = responseId 
        }).catch ((error) => {

            console.log(ExceptionMessages.GatewayCallingExecutionFailed) 
            applicationInsights?.LogException(configManager.config!.RequestCorrelationId!, TrackingMessages.GatewayCallingExecutionException, error, TrackingMessages.ActionFile) 
            var finalError = new Error() 
            try {

                let err = error as { response: http.IncomingMessage;  body: MSEssGatewayClientContractsOperationResponse  } 
                finalError = new Error(err.response.statusCode + '--' + err.response.statusMessage) 
            }
            catch (er) {

                throw error 
            }
            throw finalError 
        }) 
        await gatewayCommunicator.GatewayPolling(operationId).then().catch((error) => {

            console.log(ExceptionMessages.GatewayPollingExecutionFailed) 
            applicationInsights?.LogException(configManager.config!.RequestCorrelationId!, TrackingMessages.GatewayPollingExecutionException, error, TrackingMessages.ActionFile) 
            var finalError = new Error() 
            try {

                let err = error as { response: http.IncomingMessage ; body: MSEssGatewayClientContractsReleaseResponseReleaseDetailsMessage } 
                finalError = new Error(err.response.statusCode + '--' + err.response.statusMessage) 
            }
            catch (er) {

                throw error 
            }
            throw finalError 
        }) 

        console.log(Constant.HappyPathSuccessExecutionMessage) 

        if (configManager.config.MavenCheck == Constant.MavenCheck && MSEssGatewayClientContractsReleaseResponseReleaseDetailsMessage.StatusEnum.Pass ){

            var packageManager = new PackageManager(configManager.config!)
            
            await packageManager.PopulatePackageDetail().then(()=>{

                console.log(Constant.PackageDetails)

            }).catch((error)=>{
                
                console.log(error)
            })
        }
    }
    catch (error) {

        console.log(ExceptionMessages.ExecutionFailed) 
        console.log('CorrelationId: ' + configManager!.config!.RequestCorrelationId) 
        try {

            let err = error as Error 
            console.log(err.message) 
        }
        catch (er) {

            console.log(error) 
        }
       core.setFailed( Constant.FailurePathExecutionMessage) 
    }
}

run() 

import * as GatewayClient from '../../Ms.Ess.Release.Task.Common/GatewayApiSpec/api'
import delay from 'delay'
import { AuthenticationManager } from "../Managers/authContextManager" 
import { Constant } from '../../Ms.Ess.Release.Task.Common/Configuration/constants' 
import { IConfig } from "../../Ms.Ess.Release.Task.Common/Configuration/iConfig" 
import { IMessageCreator } from "../../Ms.Ess.Release.Task.Common/Utilities/iMessageCreator" 
import { MessageCreator } from '../../Ms.Ess.Release.Task.Common/Utilities/messageCreator' 
import { ExceptionMessages } from '../../Ms.Ess.Release.Task.Common/Exceptions/exceptionMessages' 
import { IAuthenticationManager } from '../Managers/iAuthContextManager'

export class GatewayCaller {

    config?: IConfig 
    authContext?: IAuthenticationManager
    messageCreator?: IMessageCreator 

    public constructor(_config: IConfig, _authContext?: IAuthenticationManager,
        _messageCreator?: IMessageCreator) {

        this.config = _config 
        this.authContext = _authContext ? _authContext : new AuthenticationManager(this.config) 
        this.messageCreator = _messageCreator ? _messageCreator : new MessageCreator(this.config) 
    }

    public async GatewayCalling(): Promise<string> {
    
        await this.FillAccessToken().then() 
        var containerSas = await this.FetchContainerSas().then() 
        var oAuth = new GatewayClient.OAuth() 
        oAuth.accessToken = this.authContext?.accessToken! 
        
        var releaseApi = new GatewayClient.ReleaseApi() 
        releaseApi.setDefaultAuthentication(oAuth) 
        releaseApi.basePath = this.config!.ServiceEndpointUrl! 
       
        var request = new GatewayClient.MSEssGatewayClientContractsReleaseRequestReleaseRequestMessage 
        
        request= await this.messageCreator!.PopulateReleaseRequestMessage(containerSas).then()
        
        console.log(Constant.GatewayRequestMessage)
        request.version = Constant.VersionNumber2 
    
        var operationResponse = await releaseApi.releasePostRelease2Async(this.config!.ClientId!, Constant.VersionNumber2, request) 
    
        var operationId = operationResponse.body.operationId 

        console.log(Constant.GatewayResponseMessage + operationId + '\n') 

        return operationId! 
    }

    public async GatewayPolling(operationId: string) {

        var oAuth = new GatewayClient.OAuth() 
        oAuth.accessToken = this.authContext?.accessToken! 
        var releaseApi = new GatewayClient.ReleaseApi() 
        releaseApi.setDefaultAuthentication(oAuth) 
        releaseApi.basePath = this.config!.ServiceEndpointUrl! 
        while (true) {

            console.log(Constant.ReleaseDetailsFetchingMessage) 
            
            var releaseResponse = await releaseApi.releaseGetReleaseDetailsByReleaseIdAsync(operationId?.toString() as string, this.config!.ClientId!, Constant.VersionNumber2) 
            
            var responseStatus = releaseResponse.body.status 

            if (this.IsTerminalReached(responseStatus!) == true) {

                console.log(operationId + Constant.HasReachedTerminalState + responseStatus?.toString() + '\n') 

                if (responseStatus != GatewayClient.MSEssGatewayClientContractsReleaseResponseReleaseDetailsMessage.StatusEnum.Pass) {

                    throw new Error(ExceptionMessages.OperationIdStatusNotSuccess +
                        "ErrorMessage : " + releaseResponse.body.releaseError?.errorMessages
                        + ", ErrorCode : " + releaseResponse.body.releaseError?.errorCode) 
                }

                break 
            }
            console.log(operationId + Constant.Status + responseStatus + '\n') 
            console.log(Constant.ReleaseUIAccessMessage + operationId + '\n') 
            await delay(this.config!.StatusPollingInterval!) 
        }
    }
    
    public IsTerminalReached(responseStatus: GatewayClient.MSEssGatewayClientContractsReleaseResponseReleaseDetailsMessage.StatusEnum): boolean {
        
        if(responseStatus == GatewayClient.MSEssGatewayClientContractsReleaseResponseReleaseDetailsMessage.StatusEnum.Pass
            || responseStatus == GatewayClient.MSEssGatewayClientContractsReleaseResponseReleaseDetailsMessage.StatusEnum.Cancelled
            || responseStatus == GatewayClient.MSEssGatewayClientContractsReleaseResponseReleaseDetailsMessage.StatusEnum.FailCanRetry
            || responseStatus == GatewayClient.MSEssGatewayClientContractsReleaseResponseReleaseDetailsMessage.StatusEnum.FailDoNotRetry){
            return true 
        }
        else{
            return false 
        }
    }
    
    private async FillAccessToken() {

        if(this.authContext?.accessToken == undefined) {

            await this.authContext!.setAccessToken().catch((error: any) => {

                throw error 
            }) 
        }
    }

    private async FetchContainerSas() : Promise<URL> {

        await this.FillAccessToken().then() 
    
        var oAath = new GatewayClient.OAuth() 
        oAath.accessToken = this.authContext?.accessToken! 
    
        var sessionApi = new GatewayClient.SessionApi() 
        sessionApi.setDefaultAuthentication(oAath) 
        sessionApi.basePath = this.config!.ServiceEndpointUrl! 
    
        var request = new GatewayClient.MSEssGatewayClientContractsSessionRequestMessage 
    
        request = await this.messageCreator!.PopulateSessionRequestMessage().then() 
    
        console.log(Constant.GatewaySessionRequestMessageSend)
    
        var operationResponse = await sessionApi.sessionCreateSessionAsync(this.config!.ClientId!, Constant.VersionNumber2, request) 
    
        var sessionResponseShards = operationResponse?.body?.storageResult?.storageShards 
        let containerSaS = new URL(sessionResponseShards![0].shardLocation?.bloburl as string) 
    
        console.log(Constant.GatewaySessionsShardsReceived) 

        return containerSaS 
    }
    
}
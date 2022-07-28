import * as GatewayClient from '../GatewayApiSpec/api'

export interface IMessageCreator{
    
    PopulateReleaseRequestMessage(containerSas:URL):Promise<GatewayClient.MSEssGatewayClientContractsReleaseRequestReleaseRequestMessage>
    PopulateSessionRequestMessage():Promise<GatewayClient.MSEssGatewayClientContractsSessionRequestMessage>
}
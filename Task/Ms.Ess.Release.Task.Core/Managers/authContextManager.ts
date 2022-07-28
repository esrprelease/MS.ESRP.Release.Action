import { IAuthenticationManager } from "./iAuthContextManager" 
import { IConfig } from "../../Ms.Ess.Release.Task.Common/Configuration/iConfig" 
import Msal =require('@azure/msal-node')
import { ExceptionMessages } from "../../Ms.Ess.Release.Task.Common/Exceptions/exceptionMessages" 
import { Constant } from "../../Ms.Ess.Release.Task.Common/Configuration/constants" 

export class AuthenticationManager implements IAuthenticationManager {
    
    accessToken?: string 
    config?: IConfig 
    SNIPinningFlag: string 

    public constructor(_config: IConfig) {

        this.config = _config 
        this.accessToken = undefined 
        this.SNIPinningFlag = 'true' 
    }
    
    public async setAccessToken() : Promise<string | undefined> {
        
        var authorityHostUrl = Constant.AuthorityHostUrl 
        var tenant = this.config?.DomainTenantId 
        var authorityUrl = authorityHostUrl + '/' + tenant 
        var resourceUri = this.config!.ServiceEndpointUrl 
    
        const clientConfig = {

            auth: {

                clientId: this.config!.ClientId!,
                authority: authorityUrl,
                clientCertificate: {

                    thumbprint: this.config!.AuthCertThumbprint!,
                    privateKey: this.config!.AuthPrivateKey!,
                    x5c: this.SNIPinningFlag
                }
            }
        } 
        
        const cca = new Msal.ConfidentialClientApplication(clientConfig) 
        var gatewayScope = resourceUri + Constant.APIAccessDefaultScope 
        const clientCredentialRequest = {

            scopes: [gatewayScope]
        } 
    
        await cca.acquireTokenByClientCredential(clientCredentialRequest).then((response) => {

            this.accessToken = response?.accessToken! 
        }).catch((error) => {

            console.log(ExceptionMessages.TokenAcquiringError) 
            throw error 
        }) 

        return Constant.Success 
    }
}
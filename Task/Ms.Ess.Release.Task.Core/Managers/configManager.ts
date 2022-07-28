import { IConfig } from "../../Ms.Ess.Release.Task.Common/Configuration/iConfig"  
import { Config } from "../../Ms.Ess.Release.Task.Common/Configuration/config"  
import { ConfigKeys } from "../../Ms.Ess.Release.Task.Common/Configuration/configKeys"  
import { KVIdentityConfig } from "../../Ms.Ess.Release.Task.Common/Configuration/keyVaultIndentityConfig"  
import { KeyVaultSecret } from "@azure/keyvault-secrets" 
import { KeyVaultCertificateWithPolicy } from "@azure/keyvault-certificates" 
import { convertPFX } from "../../Ms.Ess.Release.Task.Common/Utilities/certConverter" 
import * as keyVaultUtility from '../../Ms.Ess.Release.Task.Common/Utilities/keyVaultUtility' 
import { ExceptionMessages } from "../../Ms.Ess.Release.Task.Common/Exceptions/exceptionMessages"  
import { Constant } from "../../Ms.Ess.Release.Task.Common/Configuration/constants" 
import * as core from '@actions/core'
import path from 'path'

export class ConfigManager{
    
    config: IConfig
    
    public constructor(_config?:IConfig){
        
        this.config=(_config==undefined?new Config():_config)
    }

    public async PopulateConfiguration(){
        
        this.setConfigVariables()
        this.setKVIdentityConfig()
        await this.SetCertificatesInfo().catch((error) => {
           
            console.log(ExceptionMessages.CertPopulatingError)
            throw error 
        }) 
    }

    private setConfigVariables(){
       
        this.config.DomainTenantId = core.getInput(ConfigKeys.DomainTenantId)
        this.config.ServiceEndpointUrl=core.getInput(ConfigKeys.ServiceEndpointUrl)
        this.config.AppInsightsLoggingKey = Constant.AppInsightsLoggingKey
        this.config.MainPublisher = core.getInput(ConfigKeys.MainPublisher)
        this.config.Intent = core.getInput(ConfigKeys.Intent)
        this.config.ContentType = core.getInput(ConfigKeys.ContentType)
        this.config.ContentOrigin = core.getInput(ConfigKeys.ContentOrigin)
        this.config.ProductState = core.getInput(ConfigKeys.ProductState)
        this.config.Audience = core.getInput(ConfigKeys.Audience)
        this.config.MavenCheck = core.getInput(ConfigKeys.MavenCheck)
        this.config.PackageLocation=core.getInput(ConfigKeys.PackageLocation) 
        this.config.Environment = core.getInput(ConfigKeys.Environment) 
        this.config.Owners = core.getInput(ConfigKeys.Owners) 
        this.config.Approvers = core.getInput(ConfigKeys.Approvers) 
        this.config.StatusPollingInterval = Constant.DelayBetweenEveryGetStatus 
        core.addPath(path.join(__dirname, Constant.TaskJsonDistanceFromManagerFolder)) 
        this.config.ConnectedServiceName = core.getInput(ConfigKeys.ConnectedServiceName) 

        if (this.config.ConnectedServiceName == Constant.Bad || this.config.ConnectedServiceName == undefined) {

            throw new Error(ExceptionMessages.BadInputGivenFor + ConfigKeys?.ConnectedServiceName) 
        } 
    }

    private setKVIdentityConfig(){
        this.config.KVIdentityConfig= new KVIdentityConfig()
        
        if (this.config.Environment != undefined && this.config.Environment == Constant.Developer) {
            this.config.KVIdentityConfig.ClientId = core.getInput(ConfigKeys.KvClientId) 
            this.config.KVIdentityConfig.TenantId = core.getInput(ConfigKeys.KvTenantId ) 
            this.config.KVIdentityConfig.KeyVaultName = core.getInput(ConfigKeys.KvKeyVaultName ) 
            this.config.KVIdentityConfig.AuthCertName = core.getInput(ConfigKeys.KvAuthCertName ) 
            this.config.KVIdentityConfig.SignCertName = core.getInput(ConfigKeys.KvSignCertName ) 
            this.config.KVIdentityConfig.ClientSecret = core.getInput(ConfigKeys.KvSecret ) 
        }
        else{
            try {

                this.config.KVIdentityConfig.TenantId= process.env['KVTENANTID']
                this.config.KVIdentityConfig.KeyVaultName= process.env['KVNAME']
                this.config.KVIdentityConfig.AuthCertName= process.env['AUTHCERTNAME']
                this.config.KVIdentityConfig.SignCertName= process.env['SIGNCERTNAME']
                this.config.KVIdentityConfig.ClientId= process.env["KVAUTHCLIENT"]
                this.config.KVIdentityConfig.ClientSecret= process.env["KVAUTHSECRET"]
           
            }
            catch (error) {

                console.log(ExceptionMessages.KVConfigSetUpError) 
                throw error 
            }
        }
        
        this.config.ClientId= this.config.KVIdentityConfig.SignCertName
    }

    private async SetCertificatesInfo(){
        const authSecretCertificate: KeyVaultSecret = await keyVaultUtility.FetchCertFromSecretClient(this.config.KVIdentityConfig!, this.config.KVIdentityConfig!.AuthCertName!) 
        const authCertInfo = convertPFX(authSecretCertificate.value!) 
        const authCertificate: KeyVaultCertificateWithPolicy = await keyVaultUtility.FetchCertFromCertificateClient(this.config.KVIdentityConfig!,this.config.KVIdentityConfig!.AuthCertName!) 

        var authCer = authCertificate.cer 
        var encodedAuthThumbprint = authCertificate.properties.x509Thumbprint 

       this.config.AuthCertThumbprint = Buffer.from(encodedAuthThumbprint!).toString("hex") 
       this.config.AuthPublicCert = Buffer.from(authCer!).toString("base64") 
       this.config.AuthPrivateKey = authCertInfo.key 
        
        
        const signSecretCertificate: KeyVaultSecret = await keyVaultUtility.FetchCertFromSecretClient(this.config.KVIdentityConfig!, this.config.KVIdentityConfig!.SignCertName!) 
        const signCertificate: KeyVaultCertificateWithPolicy = await keyVaultUtility.FetchCertFromCertificateClient(this.config.KVIdentityConfig!,this.config.KVIdentityConfig!.SignCertName!) 

        const signCertInfo = convertPFX(signSecretCertificate.value!) 

        var signCer = signCertificate.cer 
        var encodedSignThumbprint = signCertificate.properties.x509Thumbprint 

        this.config.SignPrivateKey = signCertInfo.key
        this.config.SignPublicCert = Buffer.from(signCer!).toString("base64") 
        this.config.SignCertThumbprint = Buffer.from(encodedSignThumbprint!).toString("hex") 
        
    }

}

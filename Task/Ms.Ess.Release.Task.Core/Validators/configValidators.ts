import { ConfigKeys } from "../../Ms.Ess.Release.Task.Common/Configuration/configKeys" 
import { ExceptionMessages } from "../../Ms.Ess.Release.Task.Common/Exceptions/exceptionMessages" 
import { IConfig } from "../../Ms.Ess.Release.Task.Common/Configuration/iConfig" 
import { AggregateError } from "bluebird" 

export class Validator {

    public constructor() {}

    public async ValidateConfig(config: IConfig) : Promise<boolean | AggregateError> {

        let valid = true 
        var aggregatedException: AggregateError = new AggregateError() 
        if (config.ConnectedServiceName == undefined) {

            valid = false 
            aggregatedException.push(new Error(ConfigKeys!.ConnectedServiceName + ExceptionMessages.IsNull)) 
        }
        if (config.KVIdentityConfig == undefined) {

            valid = false 
            aggregatedException.push(new Error(ExceptionMessages.KVConfigNull)) 
        }
        if (config.KVIdentityConfig != null) {

            if (config.KVIdentityConfig.SignCertName == undefined) {

                valid = false 
                aggregatedException.push(new Error(ExceptionMessages.SigningCertNull)) 
            }
            if (config.KVIdentityConfig.ClientId == undefined) {

                valid = false 
                aggregatedException.push(Error(ExceptionMessages.ClientIdNull)) 
            }
            if (config.KVIdentityConfig.ClientSecret == undefined) {

                valid = false 
                aggregatedException.push(new Error(ExceptionMessages.ClientSecretNull)) 
            }
            if (config.KVIdentityConfig.KeyVaultName == undefined) {

                valid = false 
                aggregatedException.push(new Error(ExceptionMessages.KeyVaultNameNull)) 
            }
            if (config.KVIdentityConfig.SignCertName == undefined) {

                valid = false 
                aggregatedException.push(new Error(ExceptionMessages.SignCertNameNull)) 
            }
            if (config.KVIdentityConfig.TenantId == undefined) {

                valid = false 
                aggregatedException.push(new Error(ExceptionMessages.TenantIdNull)) 
            }
        }
        if (config.ServiceEndpointUrl == undefined) {

            valid = false 
            aggregatedException.push(new Error(ExceptionMessages.ServiceEndpointUrlNull)) 
        }
        if (config.ClientId == undefined) {

            valid = false 
            aggregatedException.push(new Error(ConfigKeys!.ClientId + ExceptionMessages.IsNull)) 
        }
        if (config.DomainTenantId == undefined) {

            valid = false 
            aggregatedException.push(new Error(ConfigKeys!.DomainTenantId + ExceptionMessages.IsNull)) 
        }
        if (config.StatusPollingInterval == undefined) {

            valid = false 
            aggregatedException.push(new Error(ConfigKeys!.StatusPollingInterval + ExceptionMessages.IsNull)) 
        }
        if (config.SignPublicCert == undefined) {

            valid = false 
            aggregatedException.push(new Error(ExceptionMessages.SignPublicCertNull)) 
        }
        if (config.SignPrivateKey == undefined) {

            valid = false 
            aggregatedException.push(new Error(ExceptionMessages.SignPrivateKeyNull)) 
        }
        if (config.SignCertThumbprint == undefined) {

            valid = false 
            aggregatedException.push(new Error(ExceptionMessages.SignCertThumbprintNull)) 
        }
        if (config.AuthPublicCert == undefined) {

            valid = false 
            aggregatedException.push(new Error(ExceptionMessages.AuthPublicCertNull)) 
        }
        if (config.AuthPrivateKey == undefined) {

            valid = false 
            aggregatedException.push(new Error(ExceptionMessages.AuthPrivateKeyNull)) 
        }
        if (config.AuthCertThumbprint == undefined) {

            valid = false 
            aggregatedException.push(new Error(ExceptionMessages.AuthCertThumbprintNull)) 
        }
        if (config.MainPublisher == undefined) {

            valid = false 
            aggregatedException.push(new Error(ConfigKeys!.MainPublisher + ExceptionMessages.IsNull)) 
        }
        if (config.Intent == undefined) {

            valid = false 
            aggregatedException.push(new Error(ConfigKeys!.Intent + ExceptionMessages.IsNull)) 
        }
        if (config.ContentType == undefined) {

            valid = false 
            aggregatedException.push(new Error(ConfigKeys!.ContentType + ExceptionMessages.IsNull)) 
        }
        if (config.PackageLocation == undefined) {

            valid = false 
            aggregatedException.push(new Error(ConfigKeys!.PackageLocation + ExceptionMessages.IsNull)) 
        }
        if (config.Owners == undefined) {

            valid = false 
            aggregatedException.push(new Error(ConfigKeys!.Owners + ExceptionMessages.IsNull)) 
        }
        if (config.Approvers == undefined) {

            valid = false 
            aggregatedException.push(new Error(ConfigKeys!.Approvers + ExceptionMessages.IsNull)) 
        }
    
        if (valid == false) {

            throw aggregatedException 
        }
        else {

            return valid 
        }
    }
}
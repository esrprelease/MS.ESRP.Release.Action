"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validator = void 0;
const configKeys_1 = require("../../Ms.Ess.Release.Task.Common/Configuration/configKeys");
const exceptionMessages_1 = require("../../Ms.Ess.Release.Task.Common/Exceptions/exceptionMessages");
const bluebird_1 = require("bluebird");
class Validator {
    constructor() { }
    ValidateConfig(config) {
        return __awaiter(this, void 0, void 0, function* () {
            let valid = true;
            var aggregatedException = new bluebird_1.AggregateError();
            if (config.ConnectedServiceName == undefined) {
                valid = false;
                aggregatedException.push(new Error(configKeys_1.ConfigKeys.ConnectedServiceName + exceptionMessages_1.ExceptionMessages.IsNull));
            }
            if (config.KVIdentityConfig == undefined) {
                valid = false;
                aggregatedException.push(new Error(exceptionMessages_1.ExceptionMessages.KVConfigNull));
            }
            if (config.KVIdentityConfig != null) {
                if (config.KVIdentityConfig.SignCertName == undefined) {
                    valid = false;
                    aggregatedException.push(new Error(exceptionMessages_1.ExceptionMessages.SigningCertNull));
                }
                if (config.KVIdentityConfig.ClientId == undefined) {
                    valid = false;
                    aggregatedException.push(Error(exceptionMessages_1.ExceptionMessages.ClientIdNull));
                }
                if (config.KVIdentityConfig.ClientSecret == undefined) {
                    valid = false;
                    aggregatedException.push(new Error(exceptionMessages_1.ExceptionMessages.ClientSecretNull));
                }
                if (config.KVIdentityConfig.KeyVaultName == undefined) {
                    valid = false;
                    aggregatedException.push(new Error(exceptionMessages_1.ExceptionMessages.KeyVaultNameNull));
                }
                if (config.KVIdentityConfig.SignCertName == undefined) {
                    valid = false;
                    aggregatedException.push(new Error(exceptionMessages_1.ExceptionMessages.SignCertNameNull));
                }
                if (config.KVIdentityConfig.TenantId == undefined) {
                    valid = false;
                    aggregatedException.push(new Error(exceptionMessages_1.ExceptionMessages.TenantIdNull));
                }
            }
            if (config.ServiceEndpointUrl == undefined) {
                valid = false;
                aggregatedException.push(new Error(exceptionMessages_1.ExceptionMessages.ServiceEndpointUrlNull));
            }
            if (config.ClientId == undefined) {
                valid = false;
                aggregatedException.push(new Error(configKeys_1.ConfigKeys.ClientId + exceptionMessages_1.ExceptionMessages.IsNull));
            }
            if (config.DomainTenantId == undefined) {
                valid = false;
                aggregatedException.push(new Error(configKeys_1.ConfigKeys.DomainTenantId + exceptionMessages_1.ExceptionMessages.IsNull));
            }
            if (config.StatusPollingInterval == undefined) {
                valid = false;
                aggregatedException.push(new Error(configKeys_1.ConfigKeys.StatusPollingInterval + exceptionMessages_1.ExceptionMessages.IsNull));
            }
            if (config.SignPublicCert == undefined) {
                valid = false;
                aggregatedException.push(new Error(exceptionMessages_1.ExceptionMessages.SignPublicCertNull));
            }
            if (config.SignPrivateKey == undefined) {
                valid = false;
                aggregatedException.push(new Error(exceptionMessages_1.ExceptionMessages.SignPrivateKeyNull));
            }
            if (config.SignCertThumbprint == undefined) {
                valid = false;
                aggregatedException.push(new Error(exceptionMessages_1.ExceptionMessages.SignCertThumbprintNull));
            }
            if (config.AuthPublicCert == undefined) {
                valid = false;
                aggregatedException.push(new Error(exceptionMessages_1.ExceptionMessages.AuthPublicCertNull));
            }
            if (config.AuthPrivateKey == undefined) {
                valid = false;
                aggregatedException.push(new Error(exceptionMessages_1.ExceptionMessages.AuthPrivateKeyNull));
            }
            if (config.AuthCertThumbprint == undefined) {
                valid = false;
                aggregatedException.push(new Error(exceptionMessages_1.ExceptionMessages.AuthCertThumbprintNull));
            }
            if (config.MainPublisher == undefined) {
                valid = false;
                aggregatedException.push(new Error(configKeys_1.ConfigKeys.MainPublisher + exceptionMessages_1.ExceptionMessages.IsNull));
            }
            if (config.Intent == undefined) {
                valid = false;
                aggregatedException.push(new Error(configKeys_1.ConfigKeys.Intent + exceptionMessages_1.ExceptionMessages.IsNull));
            }
            if (config.ContentType == undefined) {
                valid = false;
                aggregatedException.push(new Error(configKeys_1.ConfigKeys.ContentType + exceptionMessages_1.ExceptionMessages.IsNull));
            }
            if (config.PackageLocation == undefined) {
                valid = false;
                aggregatedException.push(new Error(configKeys_1.ConfigKeys.PackageLocation + exceptionMessages_1.ExceptionMessages.IsNull));
            }
            if (config.Owners == undefined) {
                valid = false;
                aggregatedException.push(new Error(configKeys_1.ConfigKeys.Owners + exceptionMessages_1.ExceptionMessages.IsNull));
            }
            if (config.Approvers == undefined) {
                valid = false;
                aggregatedException.push(new Error(configKeys_1.ConfigKeys.Approvers + exceptionMessages_1.ExceptionMessages.IsNull));
            }
            if (valid == false) {
                throw aggregatedException;
            }
            else {
                return valid;
            }
        });
    }
}
exports.Validator = Validator;

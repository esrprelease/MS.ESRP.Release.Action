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
exports.AuthenticationManager = void 0;
const Msal = require("@azure/msal-node");
const exceptionMessages_1 = require("../../Ms.Ess.Release.Task.Common/Exceptions/exceptionMessages");
const constants_1 = require("../../Ms.Ess.Release.Task.Common/Configuration/constants");
class AuthenticationManager {
    constructor(_config) {
        this.config = _config;
        this.accessToken = undefined;
        this.SNIPinningFlag = 'true';
    }
    setAccessToken() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            var authorityHostUrl = constants_1.Constant.AuthorityHostUrl;
            var tenant = (_a = this.config) === null || _a === void 0 ? void 0 : _a.DomainTenantId;
            var authorityUrl = authorityHostUrl + '/' + tenant;
            var resourceUri = this.config.ServiceEndpointUrl;
            const clientConfig = {
                auth: {
                    clientId: this.config.ClientId,
                    authority: authorityUrl,
                    clientCertificate: {
                        thumbprint: this.config.AuthCertThumbprint,
                        privateKey: this.config.AuthPrivateKey,
                        x5c: this.SNIPinningFlag
                    }
                }
            };
            const cca = new Msal.ConfidentialClientApplication(clientConfig);
            var gatewayScope = resourceUri + constants_1.Constant.APIAccessDefaultScope;
            const clientCredentialRequest = {
                scopes: [gatewayScope]
            };
            yield cca.acquireTokenByClientCredential(clientCredentialRequest).then((response) => {
                this.accessToken = response === null || response === void 0 ? void 0 : response.accessToken;
            }).catch((error) => {
                console.log(exceptionMessages_1.ExceptionMessages.TokenAcquiringError);
                throw error;
            });
            return constants_1.Constant.Success;
        });
    }
}
exports.AuthenticationManager = AuthenticationManager;

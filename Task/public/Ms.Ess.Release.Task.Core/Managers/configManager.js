"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigManager = void 0;
const config_1 = require("../../Ms.Ess.Release.Task.Common/Configuration/config");
const configKeys_1 = require("../../Ms.Ess.Release.Task.Common/Configuration/configKeys");
const keyVaultIndentityConfig_1 = require("../../Ms.Ess.Release.Task.Common/Configuration/keyVaultIndentityConfig");
const certConverter_1 = require("../../Ms.Ess.Release.Task.Common/Utilities/certConverter");
const keyVaultUtility = __importStar(require("../../Ms.Ess.Release.Task.Common/Utilities/keyVaultUtility"));
const exceptionMessages_1 = require("../../Ms.Ess.Release.Task.Common/Exceptions/exceptionMessages");
const constants_1 = require("../../Ms.Ess.Release.Task.Common/Configuration/constants");
const core = __importStar(require("@actions/core"));
const path_1 = __importDefault(require("path"));
class ConfigManager {
    constructor(_config) {
        this.config = (_config == undefined ? new config_1.Config() : _config);
    }
    PopulateConfiguration() {
        return __awaiter(this, void 0, void 0, function* () {
            this.setConfigVariables();
            this.setKVIdentityConfig();
            yield this.SetCertificatesInfo().catch((error) => {
                console.log(exceptionMessages_1.ExceptionMessages.CertPopulatingError);
                throw error;
            });
        });
    }
    setConfigVariables() {
        this.config.DomainTenantId = core.getInput(configKeys_1.ConfigKeys.DomainTenantId);
        this.config.ServiceEndpointUrl = core.getInput(configKeys_1.ConfigKeys.ServiceEndpointUrl);
        this.config.AppInsightsLoggingKey = constants_1.Constant.AppInsightsLoggingKey;
        this.config.MainPublisher = core.getInput(configKeys_1.ConfigKeys.MainPublisher);
        this.config.Intent = core.getInput(configKeys_1.ConfigKeys.Intent);
        this.config.ContentType = core.getInput(configKeys_1.ConfigKeys.ContentType);
        this.config.ContentOrigin = core.getInput(configKeys_1.ConfigKeys.ContentOrigin);
        this.config.ProductState = core.getInput(configKeys_1.ConfigKeys.ProductState);
        this.config.Audience = core.getInput(configKeys_1.ConfigKeys.Audience);
        this.config.MavenCheck = core.getInput(configKeys_1.ConfigKeys.MavenCheck);
        this.config.PackageLocation = core.getInput(configKeys_1.ConfigKeys.PackageLocation);
        this.config.Environment = core.getInput(configKeys_1.ConfigKeys.Environment);
        this.config.Owners = core.getInput(configKeys_1.ConfigKeys.Owners);
        this.config.Approvers = core.getInput(configKeys_1.ConfigKeys.Approvers);
        this.config.StatusPollingInterval = constants_1.Constant.DelayBetweenEveryGetStatus;
        core.addPath(path_1.default.join(__dirname, constants_1.Constant.TaskJsonDistanceFromManagerFolder));
        this.config.ConnectedServiceName = core.getInput(configKeys_1.ConfigKeys.ConnectedServiceName);
        if (this.config.ConnectedServiceName == constants_1.Constant.Bad || this.config.ConnectedServiceName == undefined) {
            throw new Error(exceptionMessages_1.ExceptionMessages.BadInputGivenFor + (configKeys_1.ConfigKeys === null || configKeys_1.ConfigKeys === void 0 ? void 0 : configKeys_1.ConfigKeys.ConnectedServiceName));
        }
    }
    setKVIdentityConfig() {
        this.config.KVIdentityConfig = new keyVaultIndentityConfig_1.KVIdentityConfig();
        if (this.config.Environment != undefined && this.config.Environment == constants_1.Constant.Developer) {
            this.config.KVIdentityConfig.ClientId = core.getInput(configKeys_1.ConfigKeys.KvClientId);
            this.config.KVIdentityConfig.TenantId = core.getInput(configKeys_1.ConfigKeys.KvTenantId);
            this.config.KVIdentityConfig.KeyVaultName = core.getInput(configKeys_1.ConfigKeys.KvKeyVaultName);
            this.config.KVIdentityConfig.AuthCertName = core.getInput(configKeys_1.ConfigKeys.KvAuthCertName);
            this.config.KVIdentityConfig.SignCertName = core.getInput(configKeys_1.ConfigKeys.KvSignCertName);
            this.config.KVIdentityConfig.ClientSecret = core.getInput(configKeys_1.ConfigKeys.KvSecret);
        }
        else {
            try {
                this.config.KVIdentityConfig.TenantId = process.env['KVTENANTID'];
                this.config.KVIdentityConfig.KeyVaultName = process.env['KVNAME'];
                this.config.KVIdentityConfig.AuthCertName = process.env['AUTHCERTNAME'];
                this.config.KVIdentityConfig.SignCertName = process.env['SIGNCERTNAME'];
                this.config.KVIdentityConfig.ClientId = process.env["KVAUTHCLIENT"];
                this.config.KVIdentityConfig.ClientSecret = process.env["KVAUTHSECRET"];
            }
            catch (error) {
                console.log(exceptionMessages_1.ExceptionMessages.KVConfigSetUpError);
                throw error;
            }
        }
        this.config.ClientId = this.config.KVIdentityConfig.SignCertName;
    }
    SetCertificatesInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            const authSecretCertificate = yield keyVaultUtility.FetchCertFromSecretClient(this.config.KVIdentityConfig, this.config.KVIdentityConfig.AuthCertName);
            const authCertInfo = (0, certConverter_1.convertPFX)(authSecretCertificate.value);
            const authCertificate = yield keyVaultUtility.FetchCertFromCertificateClient(this.config.KVIdentityConfig, this.config.KVIdentityConfig.AuthCertName);
            var authCer = authCertificate.cer;
            var encodedAuthThumbprint = authCertificate.properties.x509Thumbprint;
            this.config.AuthCertThumbprint = Buffer.from(encodedAuthThumbprint).toString("hex");
            this.config.AuthPublicCert = Buffer.from(authCer).toString("base64");
            this.config.AuthPrivateKey = authCertInfo.key;
            const signSecretCertificate = yield keyVaultUtility.FetchCertFromSecretClient(this.config.KVIdentityConfig, this.config.KVIdentityConfig.SignCertName);
            const signCertificate = yield keyVaultUtility.FetchCertFromCertificateClient(this.config.KVIdentityConfig, this.config.KVIdentityConfig.SignCertName);
            const signCertInfo = (0, certConverter_1.convertPFX)(signSecretCertificate.value);
            var signCer = signCertificate.cer;
            var encodedSignThumbprint = signCertificate.properties.x509Thumbprint;
            this.config.SignPrivateKey = signCertInfo.key;
            this.config.SignPublicCert = Buffer.from(signCer).toString("base64");
            this.config.SignCertThumbprint = Buffer.from(encodedSignThumbprint).toString("hex");
        });
    }
}
exports.ConfigManager = ConfigManager;

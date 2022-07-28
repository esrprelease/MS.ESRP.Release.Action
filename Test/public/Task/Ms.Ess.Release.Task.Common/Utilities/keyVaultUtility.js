"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
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
exports.FetchCertFromCertificateClient = exports.FetchCertFromSecretClient = void 0;
/**
 * @summary Imports a PFX and PEM certificate and then deletes them.
 */
const keyvault_certificates_1 = require("@azure/keyvault-certificates");
const identity_1 = require("@azure/identity");
const keyvault_secrets_1 = require("@azure/keyvault-secrets");
var certificateWithPolicy;
var certificateSecret;
// This sample demonstrates how to import both PKCS#12 (PFX) and PEM-formatted certificates
// into Azure Key Vault.
function FetchCertFromSecretClient(kvIdentityConfig, certName) {
    return __awaiter(this, void 0, void 0, function* () {
        // If you're using MSI, DefaultAzureCredential should "just work".
        // Otherwise, DefaultAzureCredential expects the following three environment variables:
        // - AZURE_TENANT_ID: The tenant ID in Azure Active Directory
        // - AZURE_CLIENT_ID: The application (client) ID registered in the AAD tenant
        // - AZURE_CLIENT_SECRET: The client secret for the registered application
        try {
            let kvUrl = `https://${kvIdentityConfig.KeyVaultName}.vault.azure.net`;
            SetCredentialsForRequest(kvIdentityConfig);
            const credential = new identity_1.DefaultAzureCredential();
            const secretClient = new keyvault_secrets_1.SecretClient(kvUrl, credential);
            certificateSecret = yield secretClient.getSecret(certName);
        }
        catch (err) {
            throw err;
        }
        return certificateSecret;
    });
}
exports.FetchCertFromSecretClient = FetchCertFromSecretClient;
function FetchCertFromCertificateClient(kvIdentityConfig, certName) {
    return __awaiter(this, void 0, void 0, function* () {
        // If you're using MSI, DefaultAzureCredential should "just work".
        // Otherwise, DefaultAzureCredential expects the following three environment variables:
        // - AZURE_TENANT_ID: The tenant ID in Azure Active Directory
        // - AZURE_CLIENT_ID: The application (client) ID registered in the AAD tenant
        // - AZURE_CLIENT_SECRET: The client secret for the registered application
        try {
            let kvUrl = `https://${kvIdentityConfig.KeyVaultName}.vault.azure.net`;
            SetCredentialsForRequest(kvIdentityConfig);
            const credential = new identity_1.DefaultAzureCredential();
            const client = new keyvault_certificates_1.CertificateClient(kvUrl, credential);
            certificateWithPolicy = yield client.getCertificate(certName);
        }
        catch (err) {
            throw err;
        }
        return certificateWithPolicy;
    });
}
exports.FetchCertFromCertificateClient = FetchCertFromCertificateClient;
function SetCredentialsForRequest(kvIdentityConfig) {
    process.env["AZURE_TENANT_ID"] = kvIdentityConfig.TenantId;
    process.env["AZURE_CLIENT_ID"] = kvIdentityConfig.ClientId;
    process.env["AZURE_CLIENT_SECRET"] = kvIdentityConfig.ClientSecret;
}

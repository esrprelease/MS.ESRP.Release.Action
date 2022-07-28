// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * @summary Imports a PFX and PEM certificate and then deletes them.
 */

 import { CertificateClient, KeyVaultCertificateWithPolicy } from '@azure/keyvault-certificates' 
 import { DefaultAzureCredential } from '@azure/identity' 
 import { KeyVaultSecret, SecretClient } from '@azure/keyvault-secrets'  
 import { IKVIdentityConfig } from '../Configuration/iKeyVaultIdentityConfig' 
 
 var certificateWithPolicy: KeyVaultCertificateWithPolicy 
 var certificateSecret: KeyVaultSecret 
  // This sample demonstrates how to import both PKCS#12 (PFX) and PEM-formatted certificates
  // into Azure Key Vault.
  export async function FetchCertFromSecretClient(kvIdentityConfig: IKVIdentityConfig, certName: string): Promise<KeyVaultSecret> {
    // If you're using MSI, DefaultAzureCredential should "just work".
    // Otherwise, DefaultAzureCredential expects the following three environment variables:
    // - AZURE_TENANT_ID: The tenant ID in Azure Active Directory
    // - AZURE_CLIENT_ID: The application (client) ID registered in the AAD tenant
    // - AZURE_CLIENT_SECRET: The client secret for the registered application
    try {
       
       let kvUrl: string = `https://${kvIdentityConfig.KeyVaultName}.vault.azure.net` 
 
       SetCredentialsForRequest(kvIdentityConfig) 
       const credential = new DefaultAzureCredential() 
       const secretClient = new SecretClient(kvUrl, credential) 
     
       certificateSecret = await secretClient.getSecret(certName) 
    }
    catch(err) {
       
       throw err 
    }
     return certificateSecret 
  }
 
  export async function FetchCertFromCertificateClient(kvIdentityConfig: IKVIdentityConfig, certName: string): Promise<KeyVaultCertificateWithPolicy> {
    // If you're using MSI, DefaultAzureCredential should "just work".
    // Otherwise, DefaultAzureCredential expects the following three environment variables:
    // - AZURE_TENANT_ID: The tenant ID in Azure Active Directory
    // - AZURE_CLIENT_ID: The application (client) ID registered in the AAD tenant
    // - AZURE_CLIENT_SECRET: The client secret for the registered application
    try {
 
       let kvUrl: string = `https://${kvIdentityConfig.KeyVaultName}.vault.azure.net` 
 
       SetCredentialsForRequest(kvIdentityConfig) 
       const credential = new DefaultAzureCredential() 
       const client = new CertificateClient(kvUrl, credential) 
     
       certificateWithPolicy = await client.getCertificate(certName) 
    }
    catch(err) {
       
       throw err 
    }
      return certificateWithPolicy 
  }
 
 function SetCredentialsForRequest(kvIdentityConfig: IKVIdentityConfig) {
 
    process.env["AZURE_TENANT_ID"] = kvIdentityConfig.TenantId 
    process.env["AZURE_CLIENT_ID"] = kvIdentityConfig.ClientId 
    process.env["AZURE_CLIENT_SECRET"] = kvIdentityConfig.ClientSecret 
 }
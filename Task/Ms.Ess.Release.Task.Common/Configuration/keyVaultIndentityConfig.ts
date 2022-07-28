import { IKVIdentityConfig } from "./iKeyVaultIdentityConfig" 

export class KVIdentityConfig implements IKVIdentityConfig {
    TenantId: string | undefined 
    ClientId: string | undefined 
    ClientSecret: string | undefined 
    KeyVaultName: string | undefined 
    AuthCertName: string | undefined 
    SignCertName: string | undefined 

    constructor() {
        this.TenantId=undefined
        this.ClientId=undefined
        this.ClientSecret=undefined
        this.KeyVaultName=undefined
        this.AuthCertName=undefined
        this.SignCertName=undefined
    }
}
import { IKVIdentityConfig } from './iKeyVaultIdentityConfig' 

export interface IConfig {
    
    ConnectedServiceName?: string 
    KVIdentityConfig?: IKVIdentityConfig 
    ClientId?: string 
    AuthPublicCert?: string 
    AuthPrivateKey?: string 
    AuthCertThumbprint?: string 
    SignPublicCert?: string 
    SignPrivateKey?: string 
    SignCertThumbprint?: string 
    Intent?: string 
    ContentType?: string 
    ContentOrigin?: string 
    ProductState?: string 
    Audience?: string 
    MavenCheck?: string
    PackageLocation?: string 
    Owners?: string 
    Approvers?: string 
    MainPublisher?: string 
    AppInsightsLoggingKey?: string 
    ServiceEndpointUrl?: string 
    StatusPollingInterval?: number 
    Environment?: string 
    RequestCorrelationId?: string 
    DomainTenantId?: string 
}
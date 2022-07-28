import { IConfig } from "./iConfig" 
import { IKVIdentityConfig } from "./iKeyVaultIdentityConfig" 
import { v4 as uuidv4 } from 'uuid' 

export class Config implements IConfig{
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
    MavenCheck?: string 

    constructor(){
        this.ConnectedServiceName = undefined 
        this.KVIdentityConfig = undefined 
        this.ClientId = undefined 
        this.AuthPublicCert = undefined 
        this.AuthPrivateKey = undefined 
        this.AuthCertThumbprint = undefined 
        this.SignPublicCert = undefined 
        this.SignPrivateKey = undefined 
        this.SignCertThumbprint = undefined 
        this.Intent = undefined 
        this.ContentType = undefined 
        this.ContentOrigin = undefined 
        this.ProductState = undefined 
        this.Audience = undefined 
        this.MavenCheck = undefined
        this.PackageLocation = undefined 
        this.Owners = undefined 
        this.Approvers = undefined 
        this.MainPublisher = undefined 
        this.AppInsightsLoggingKey = undefined 
        this.ServiceEndpointUrl = undefined 
        this.StatusPollingInterval = undefined 
        this.Environment = undefined 
        this.RequestCorrelationId = uuidv4() 
        this.DomainTenantId = undefined 
    }
}
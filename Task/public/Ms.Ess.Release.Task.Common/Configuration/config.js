"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
const uuid_1 = require("uuid");
class Config {
    constructor() {
        this.ConnectedServiceName = undefined;
        this.KVIdentityConfig = undefined;
        this.ClientId = undefined;
        this.AuthPublicCert = undefined;
        this.AuthPrivateKey = undefined;
        this.AuthCertThumbprint = undefined;
        this.SignPublicCert = undefined;
        this.SignPrivateKey = undefined;
        this.SignCertThumbprint = undefined;
        this.Intent = undefined;
        this.ContentType = undefined;
        this.ContentOrigin = undefined;
        this.ProductState = undefined;
        this.Audience = undefined;
        this.MavenCheck = undefined;
        this.PackageLocation = undefined;
        this.Owners = undefined;
        this.Approvers = undefined;
        this.MainPublisher = undefined;
        this.AppInsightsLoggingKey = undefined;
        this.ServiceEndpointUrl = undefined;
        this.StatusPollingInterval = undefined;
        this.Environment = undefined;
        this.RequestCorrelationId = (0, uuid_1.v4)();
        this.DomainTenantId = undefined;
    }
}
exports.Config = Config;

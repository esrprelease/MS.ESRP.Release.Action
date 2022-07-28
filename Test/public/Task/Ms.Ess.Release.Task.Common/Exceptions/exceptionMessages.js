"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExceptionMessages = void 0;
exports.ExceptionMessages = {
    // Orchestrator Layer Messages
    ConfigCreationFailed: "Creation of the configManager.config instance failed. \n",
    ConfigValidationFailed: "Validation of configManager.config instance failed. \n",
    ExecutionFailed: "Execution failed with error :- \n",
    // Validation Layer Messages
    KVConfigNull: "KVIdentityConfig is null\n",
    SigningCertNull: "SignCertName is null\n",
    ClientIdNull: "ClientId is null\n",
    ClientSecretNull: "ClientSecret is null\n",
    KeyVaultNameNull: "KeyVaultName is null\n",
    SignCertNameNull: "SignCertName is null\n",
    TenantIdNull: "TenantId is null\n",
    ServiceEndpointUrlNull: "ServiceEndpointUrl is null\n",
    SignPublicCertNull: "SignPublicCert is null\n",
    SignPrivateKeyNull: "SignPrivateKey is null\n",
    SignCertThumbprintNull: "SignCertThumbprint is null\n",
    AuthPublicCertNull: "AuthPublicCert is null\n",
    AuthPrivateKeyNull: "AuthPrivateKey is null\n",
    AuthCertThumbprintNull: "AuthCertThumbprint is null\n",
    IsNull: " is null \n",
    // Managers Layer Messages
    CertPopulatingError: "Error while fetching Certs and populating Cert info :- \n",
    BadInputGivenFor: "Bad input was given for \n",
    KVConfigSetUpError: "Error while setting up Key Vault config from Service Principle :- \n",
    TokenAcquiringError: "Error while acquiring the token :- \n",
    //Executer Layer Message
    GatewayCallingExecutionFailed: "Error while submissing request to Release Gateway \n",
    GatewayPollingExecutionFailed: "Error while polling details of the Operation id.\n",
    OperationIdStatusNotSuccess: "Release has failed ",
    // Utilities Layer Messages
    NoPOMFileExistsError: "POM file does not exist with file extension : ",
    FileUploadingAndBlobSASGeneratingError: "Error while uploading the zip file and generating sas url. \n",
    // Maven Polling Messages
    RemoteHashFetchingFailed: "Unable to retrieve remote hash for"
};

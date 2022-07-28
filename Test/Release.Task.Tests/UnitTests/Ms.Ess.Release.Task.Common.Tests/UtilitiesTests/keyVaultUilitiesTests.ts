import assert from "assert" 
import { IConfig } from "../../../../../Task/Ms.Ess.Release.Task.Common/Configuration/iConfig" 
import { ConfigManager } from "../../../../../Task/Ms.Ess.Release.Task.Core/Managers/configManager" 
import * as kvUtility from '../../../../../Task/Ms.Ess.Release.Task.Common/Utilities/keyVaultUtility'
describe('keyVaultUtilityTest', function () {
    
    this.timeout(0) 
    var config: IConfig 
    this.beforeAll(async () => {

        var configManager = new ConfigManager() 
        await configManager.PopulateConfiguration().then() 
        config = configManager.config! 
    }) 

    it('keyVaultUtilityFetchSecretSuccessTest', async function() {
 
        try {
            
            const cert = await kvUtility.FetchCertFromSecretClient(config!.KVIdentityConfig!, config!.KVIdentityConfig!.AuthCertName!) 
            assert(cert.name, config!.KVIdentityConfig!.AuthCertName) 
        }
        catch(error) {
            
            assert.fail(error as string) 
        }
    }) 

    it('keyVaultUtilityFetchCertificateSuccessTest', async function() {
 
        try {
            
            const cert = await kvUtility.FetchCertFromCertificateClient(config!.KVIdentityConfig!, config!.KVIdentityConfig!.AuthCertName!) 
            assert(cert.properties.name, config!.KVIdentityConfig!.AuthCertName) 
        }
        catch(error) {
            
            assert.fail(error as string) 
        }
    }) 
}) 
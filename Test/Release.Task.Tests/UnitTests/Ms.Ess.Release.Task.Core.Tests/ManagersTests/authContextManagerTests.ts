import { IConfig } from "../../../../../Task/Ms.Ess.Release.Task.Common/Configuration/iConfig"
import { ConfigManager } from "../../../../../Task/Ms.Ess.Release.Task.Core/Managers/configManager"
import {AuthenticationManager} from '../../../../../Task/Ms.Ess.Release.Task.Core/Managers/authContextManager'
import assert  =require("assert")
import { Constant } from "../../../../../Task/Ms.Ess.Release.Task.Common/Configuration/constants"
import { ExceptionMessages } from "../../../../../Task/Ms.Ess.Release.Task.Common/Exceptions/exceptionMessages"

describe('authContextManagerTest', function(){

    this.timeout(0)
    var config:IConfig
    this.beforeAll(async()=>{
        
        var configManager=new ConfigManager()
        await configManager.PopulateConfiguration().then() 
        config=configManager.config!

    })

    it('authContextManagerSuccessTest', async function () {
        
        var authenticationManager=new AuthenticationManager(config!)
        await authenticationManager.setAccessToken().then((response)=>{
            
            assert.equal(Constant.Success,response)
            assert.notEqual(null,authenticationManager.accessToken)
            assert.notEqual(undefined,authenticationManager.accessToken)
        }).catch((error)=>{
            
            assert.fail(ExceptionMessages.TokenAcquiringError+error as string)
        })
    })
})
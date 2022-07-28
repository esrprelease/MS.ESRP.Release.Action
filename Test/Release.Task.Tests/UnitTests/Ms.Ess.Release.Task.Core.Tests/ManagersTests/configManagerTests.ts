import assert =require('assert') 
import { ExceptionMessages } from '../../../../../Task/Ms.Ess.Release.Task.Common/Exceptions/exceptionMessages' 
import {ConfigManager} from '../../../../../Task/Ms.Ess.Release.Task.Core/Managers/configManager' 

describe('configManagerTest',function(){
    this.timeout(0)
    it('configManagerSuccessTest',async function(){
        var configManager=new ConfigManager()
        await configManager.PopulateConfiguration().catch((error)=>{
            assert.fail(ExceptionMessages.ConfigCreationFailed+error as string)
        })
    })
})
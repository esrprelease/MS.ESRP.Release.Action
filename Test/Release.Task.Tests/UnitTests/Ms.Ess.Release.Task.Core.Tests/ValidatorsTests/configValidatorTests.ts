import assert=require('assert')
import { IConfig } from "../../../../../Task/Ms.Ess.Release.Task.Common/Configuration/iConfig"
import { ExceptionMessages } from '../../../../../Task/Ms.Ess.Release.Task.Common/Exceptions/exceptionMessages'
import { ConfigManager } from "../../../../../Task/Ms.Ess.Release.Task.Core/Managers/configManager"
import {Validator} from "../../../../../Task/Ms.Ess.Release.Task.Core/Validators/configValidators"
import { TestConstants } from "../../../testConstant"
import {AggregateError} from 'bluebird'
import { ConfigKeys } from '../../../../../Task/Ms.Ess.Release.Task.Common/Configuration/configKeys'

describe('configValidatortest',function(){
    this.timeout(0)
    var config: IConfig
    var validator: Validator
    this.beforeAll(async()=>{

        var configManager= new ConfigManager
        await configManager.PopulateConfiguration().then()
        config=configManager.config!
        validator=new Validator
    })

    it ('configValidatorSuccessTest', async function(){
        setValidConfigParameters(config!)
        await validator.ValidateConfig(config!).then((response)=>{
            assert.equal(response,true)

        }).catch((error)=>{
            assert.fail(ExceptionMessages.ConfigValidationFailed+error as string)
        })
    })

    it('configValidatorClientIdMissingFailureTest', async function () {
        
        setInValidConfigParameters(config!)
        await validator.ValidateConfig(config!).then((response)=>{
            assert.fail()
        }).catch((error)=>{
            let aggregatedError=error as AggregateError
            let actualErrorName=(aggregatedError.filter(x => x.message.includes(ConfigKeys!.ClientId)))[0].message
            assert.equal(actualErrorName, ConfigKeys!.ClientId+ExceptionMessages.IsNull)
        })
        
    })

    function setValidConfigParameters(config:IConfig){
        config.ClientId=TestConstants.TestClientId
    }

    function setInValidConfigParameters(config:IConfig){
        config.ClientId=undefined
    }
})
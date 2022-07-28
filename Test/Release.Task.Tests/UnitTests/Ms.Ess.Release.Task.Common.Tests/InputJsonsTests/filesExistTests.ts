import assert from "assert" 
import * as fs from "fs" 
import path from "path" 
import { TestConstants } from "../../../testConstant" 

describe('buildTest', function () {
    describe('InputJsonTest', function () {
    
        this.timeout(0) 
        var JsonFilesRelativePath: string 
        var policyJsonName: string 
        var submitJsonName: string 
        this.beforeAll(async () => {

            JsonFilesRelativePath = TestConstants.JsonFilesRelativePathWrtTaskCommonTests 
            policyJsonName = TestConstants.PolicyJsonName 
            submitJsonName = TestConstants.SubmitJsonName 
        }) 

        it('InputJsonExistSuccessTest', async function() {

            let jsonFileLocation = path.join(__dirname, JsonFilesRelativePath) 
            const readDirMain = await fs.promises.readdir(jsonFileLocation!) 
            if(readDirMain.find(file => file.includes(policyJsonName)) == undefined) {

                assert.fail() 
            }
            if(readDirMain.find(file => file.includes(submitJsonName)) == undefined) {

                assert.fail() 
            }
        }) 
    }) 
}) 
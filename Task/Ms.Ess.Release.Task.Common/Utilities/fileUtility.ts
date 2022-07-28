import * as crypto from 'crypto' 
import * as fs from 'fs'
import { IFileUtility } from './iIFileUtility' 

export class FileUtility implements IFileUtility {

    public getFile256HashInBase64(filePath : string) : string {
        
        var hashProcessor = crypto.createHash('sha256') 
        var data = fs.readFileSync(filePath) 
        hashProcessor.update(data) 
        var gen_hash = hashProcessor.digest('base64') 
    
        return gen_hash 
    }
    
    public getFileSizeInBytes(filePath : string) : number {
        
        var stats = fs.statSync(filePath) 
        var fileSizeInBytes = stats.size 
        
        return fileSizeInBytes 
    }
}
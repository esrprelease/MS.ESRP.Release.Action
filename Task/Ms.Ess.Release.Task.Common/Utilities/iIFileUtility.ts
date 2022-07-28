export interface IFileUtility {

    getFile256HashInBase64(filePath : string) : string 
    getFileSizeInBytes(filePath : string) : number 
}
export interface IBlobUtility {

    uploadFileAndGetSas(containerSas: URL, blobName: string, filePath: string) : Promise<URL | undefined>  
} 
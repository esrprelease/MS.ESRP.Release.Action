import { IBlobUtility } from './iBlobUtility' 
import BlobStorageClient = require('@azure/storage-blob') 

export class BlobUtility implements IBlobUtility {

    public async uploadFileAndGetSas(containerSas: URL, blobName: string, filePath: string) : Promise<URL | undefined> {

        var blobServiceClient = new BlobStorageClient.ContainerClient(containerSas!.toString()) 
        var blobClient = blobServiceClient.getBlockBlobClient(blobName) 
        await blobClient.uploadFile(filePath) 
        let blobSas = containerSas 
        blobSas.pathname = this.getBlobPath(blobServiceClient, blobClient) 
        
        return blobSas 
    }

    private getBlobPath(blobServiceClient: BlobStorageClient.ContainerClient, blobClient: BlobStorageClient.BlockBlobClient) : string {
        
        let combinedPath = blobServiceClient.containerName + '/' + blobClient.name 
        return combinedPath 
    }
}
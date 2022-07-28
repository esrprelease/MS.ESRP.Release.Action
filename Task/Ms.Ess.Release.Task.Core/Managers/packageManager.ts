import fetch from 'node-fetch-commonjs'
import crypto from 'crypto'
import fs from 'fs'
import path = require('path') 
import { IPackage } from '../../Ms.Ess.Release.Task.Common/Configuration/iPackage' 
import { Package } from '../../Ms.Ess.Release.Task.Common/Configuration/package' 
import xml2js from 'xml2js'
import { IConfig } from '../../Ms.Ess.Release.Task.Common/Configuration/iConfig' 
import { Constant } from '../../Ms.Ess.Release.Task.Common/Configuration/constants' 
import { Config } from '../../Ms.Ess.Release.Task.Common/Configuration/config' 
import { ExceptionMessages } from '../../Ms.Ess.Release.Task.Common/Exceptions/exceptionMessages'

export class PackageManager{

    config?: IConfig
    package: IPackage

    public constructor(_config: IConfig,_package?:IPackage){
        
        this.config = (_config == undefined? new Config():_config) 
        this.package = (_package == undefined? new Package():_package)
    }


    public async PopulatePackageDetail(){
        await this.setPackageVariables()
        await this.TestReleasePackage(this.package.RepositoryUrl!,this.package)
    }

    private async setPackageVariables(){

        let pomFileLocation = this.config?.PackageLocation
        const readDirMain = await fs.promises.readdir(pomFileLocation!) 
        let pomFileName = readDirMain.filter(el => path.extname(el) == Constant.PomFileExtension) 
        let pomFileRaw = fs.readFileSync(path.join(pomFileLocation!, pomFileName[0]), "utf8") 
        const parser = new xml2js.Parser() 
        parser.parseString(pomFileRaw, (error: any, result: any)=> {

            if(error === null) {

                this.package.ArtifactID = result[Constant.Project][Constant.ArtifactId][0] 
                this.package.Version = result[Constant.Project][Constant.Version][0] 
                this.package.GroupID = result[Constant.Project][Constant.GroupID][0]
            }
            else {

                return new Error(error) 
            }
        }) 
        var groupId = this.package.GroupID!
        let packageFileRaw = fs.readFileSync(path.join(__dirname,Constant.PackageFilePath), "utf8") 
        this.package.RepositoryUrl = JSON.parse(packageFileRaw).ReositoryUrl[groupId]
    }

    private getFileName(pathFileName:string){
        var fullFileName = pathFileName.replace(/^.*[\\\/]/, '') 
        return fullFileName
    }

    private getFilExtension(pathFileName:string){
        var strLength:number = pathFileName.length
        if (pathFileName.substring(strLength,strLength-4) === '.jar'
        || pathFileName.substring(strLength,strLength-8) === '.jar.asc'
        || pathFileName.substring(strLength,strLength-15) === '.jar.asc.sha256'
        || pathFileName.substring(strLength,strLength-11) === '.jar.sha256'
        || pathFileName.substring(strLength,strLength-4) === '.pom'
        || pathFileName.substring(strLength,strLength-8) === '.pom.asc'
        || pathFileName.substring(strLength,strLength-11) === '.pom.sha256'
        || pathFileName.substring(strLength,strLength-15) === '.pom.asc.sha256'){return true}

        else {return false}
    }

    private async  TestReleasePackage(RepositoryUrl:string,PackageDetail:IPackage, ){
        let baseUrl:string = Constant.EmptyString

        if (RepositoryUrl === Constant.RepositoryUrl){

            baseUrl = Constant.BaseUrl
        }
        else {
            console.log(Constant.UrlCheck)
        }

        const packageUrl:string = `${baseUrl}/${PackageDetail.GroupID?.replaceAll('.','/')}/${PackageDetail.ArtifactID}/${PackageDetail.Version}`

        let remoteCount:number = Constant.InitialCountZero
        let matchCount:number = Constant.InitialCountZero

        let packageLocation = this.config?.PackageLocation
        const readDirMain = await fs.promises.readdir(packageLocation!)

        readDirMain.forEach(artifact => {
            if (this.getFilExtension(artifact)== true){
                
                const localFileName:string = this.getFileName(artifact)
                const remoteHashUrl:string = `${packageUrl}/${localFileName}`
            
                let response:any
                fetch(remoteHashUrl).then((result)=>{
                    response = result
                    
                    if (response.status >= 200 && response.status < 300) {
                        remoteCount++

                        let hash = response.headers.get("etag")
                        const remoteHash:string = response.headers.get("etag").substring(7, hash.length-3)

                        const localPath:string = `${packageLocation}/${this.getFileName(artifact)}`
                        const fileBufer:Buffer = fs.readFileSync(localPath)
                        const hashSum = crypto.createHash('sha1')
                        hashSum.update(fileBufer)
                        
                        const localHash:string = hashSum.digest('hex')

                        if (remoteHash === localHash) {
                            matchCount++
                            if (remoteCount === Constant.TotalFilesInDirectory) {
                                console.log(Constant.SuccessDeployed + "\n" + Constant.PackageUrl + packageUrl + "\n")
                            }
                        }

                        else{
                            console.log(Constant.HashNotEqual + localFileName + '\n')
                            if (remoteCount === Constant.TotalFilesInDirectory) {
                                console.log(Constant.DeployedDiffContent)
                            }
                        }   
                    }
                    else {
                        console.log(ExceptionMessages.RemoteHashFetchingFailed + localFileName + Constant.HttpResponseCode + response.status)
                    }
            
                })
            }
        })
    }
}

import { IPackage } from "./iPackage"

export class Package implements IPackage{
    GroupID?:string
    ArtifactID?:string
    Version?:string
    RepositoryUrl?:string

    constructor(){
        this.GroupID = undefined
        this.ArtifactID = undefined
        this.Version = undefined
        this.RepositoryUrl = undefined
    }
}
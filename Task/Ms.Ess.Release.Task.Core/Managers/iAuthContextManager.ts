import { IConfig } from "../../Ms.Ess.Release.Task.Common/Configuration/iConfig" 

export interface IAuthenticationManager{
    
    accessToken?: string
    config?: IConfig
    setAccessToken():Promise<string| undefined>
}
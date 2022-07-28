import { Constant } from "../Configuration/constants" 

const appInsights = require('applicationinsights') 

export class ApplicationInsights {

    public static instance?: ApplicationInsights 
    public isEnabled: boolean 
    private appInsightClient: any 

    private constructor(instrumentationKey?: string) {

        try{
            appInsights.setup(instrumentationKey) 
            appInsights.start() 
            this.appInsightClient = appInsights.defaultClient 
            this.isEnabled = true 
        }
        catch (error) {
            console.log(Constant.AppInsightErrorMessage) 
            this.isEnabled = false 
        }

    }

    public static CreateInstance(instrumentationKey?: string) : ApplicationInsights | undefined {

        if(this.instance == undefined && instrumentationKey != undefined) {
            this.instance = new ApplicationInsights(instrumentationKey) 
        }
        
        return this.instance 
    }

    private CheckAvailability() {

        if(this.isEnabled == true) {

            return true 
        }

        return false 
    }

    public LogEvent(correlationId: string, event: string, message?: string, location?: string) {

        if(this.CheckAvailability()) {

            this.appInsightClient.trackEvent({
                name: event,
                properties: {
                    message: message,
                    location: location,
                    correlationId: correlationId
                }
            }) 
        }
       
    }

    public LogTrace(correlationId: string, message: string, location?: string) {

        if(this.CheckAvailability()) {

            this.appInsightClient.trackTrace({
                message: message,
                severity: appInsights.Contracts.SeverityLevel.Information,
                properties: {
                    message: message,
                    location: location,
                    correlationId: correlationId
                }
            }) 
        }
    }

    public LogException(correlationId: string, errorMessage: string, stackTrace?: string, location?: string) {

        if(this.CheckAvailability()) {

            this.appInsightClient.trackException({
                exception: errorMessage,
                properties: {
                    message: errorMessage,
                    location: location,
                    correlationId: correlationId,
                    stackTrace: stackTrace
                }
            }) 
        }
       
    }
}
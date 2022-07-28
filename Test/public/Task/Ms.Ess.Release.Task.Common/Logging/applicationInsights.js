"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationInsights = void 0;
const constants_1 = require("../Configuration/constants");
const appInsights = require('applicationinsights');
class ApplicationInsights {
    constructor(instrumentationKey) {
        try {
            appInsights.setup(instrumentationKey);
            appInsights.start();
            this.appInsightClient = appInsights.defaultClient;
            this.isEnabled = true;
        }
        catch (error) {
            console.log(constants_1.Constant.AppInsightErrorMessage);
            this.isEnabled = false;
        }
    }
    static CreateInstance(instrumentationKey) {
        if (this.instance == undefined && instrumentationKey != undefined) {
            this.instance = new ApplicationInsights(instrumentationKey);
        }
        return this.instance;
    }
    CheckAvailability() {
        if (this.isEnabled == true) {
            return true;
        }
        return false;
    }
    LogEvent(correlationId, event, message, location) {
        if (this.CheckAvailability()) {
            this.appInsightClient.trackEvent({
                name: event,
                properties: {
                    message: message,
                    location: location,
                    correlationId: correlationId
                }
            });
        }
    }
    LogTrace(correlationId, message, location) {
        if (this.CheckAvailability()) {
            this.appInsightClient.trackTrace({
                message: message,
                severity: appInsights.Contracts.SeverityLevel.Information,
                properties: {
                    message: message,
                    location: location,
                    correlationId: correlationId
                }
            });
        }
    }
    LogException(correlationId, errorMessage, stackTrace, location) {
        if (this.CheckAvailability()) {
            this.appInsightClient.trackException({
                exception: errorMessage,
                properties: {
                    message: errorMessage,
                    location: location,
                    correlationId: correlationId,
                    stackTrace: stackTrace
                }
            });
        }
    }
}
exports.ApplicationInsights = ApplicationInsights;

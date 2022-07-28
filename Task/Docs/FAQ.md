Q – What does the flow of Github Action look like? <br/>
A – Action will generate a zip file out of the given folder, and then upload this zip file to ESRP accessible blobs and will submit the payload as a request to ESRP Release System, once it will receive an Operation Id, action will keep on polling for the Status, until the operation is completed, or the action times out.


Q – What is the polling interval for checking the status of the operation Id? <br/>
A – It’s set to every 2 minutes and is non editable.


Q – In what scenarios will the action fail?<br/>
A – Below shows the failure and success scenarios:
-	If the ESRP submission is successful and the operation id is available, action will pass irrespective of what happens with the polling. (As the status can be checked on release UI – ‘aka.ms/releaseui’)
-	If any error occurs before and on submission to ESRP Release System, the action will fail mentioning the reason for the failure.
-	If operation from ESRP System fails with status (FCR – FailCanRetry, FDNR - FailDoNotRetry), action will update the status on the console and will succeed as it has done its job successfully.
-	If the action keeps on running for default action time out period, It will fail automatically.


Q – In case of any queries, what are the contact details?<br/>
A – DL: [esrprelpm@microsoft.com](esrprelpm@microsoft.com) <br/>
A – Release stuck? [Create incident here](https://portal.microsofticm.com/imp/v3/incidents/create?tmpl=t2P123)


Q – For Maven publishing, what are the mandatory files?<br/>
A – Below screenshot shows the mandatory files for Maven publishing.<br/>
```bash 
target                                              
├─ <name>-<version>-javadoc.jar             
├─ <name>-<version>-javadoc.jar.asc         
├─ <name>-<version>-javadoc.jar.asc.sha256  
├─ <name>-<version>-javadoc.jar.sha256      
├─ <name>-<version>-sources.jar             
├─ <name>-<version>-sources.jar.asc         
├─ <name>-<version>-sources.jar.asc.sha256  
├─ <name>-<version>-sources.jar.sha256      
├─ <name>-<version>.jar                     
├─ <name>-<version>.jar.asc                 
├─ <name>-<version>.jar.asc.sha256          
├─ <name>-<version>.jar.sha256              
├─ <name>-<version>.pom                     
├─ <name>-<version>.pom.asc                 
├─ <name>-<version>.pom.asc.sha256          
└─ <name>-<version>.pom.sha256              
```


Q – How long will it take for my package to show up in Maven Central? <br/>
A – Our service SLA is defined as follow: [link](https://microsoft.sharepoint.com/teams/prss/esrp/info/ESRP%20Onboarding%20Wiki/ESRP%20Service%20Level%20Objectives.aspx). Though this is a new service we (ESRP Release) are providing and we are constantly redefining our SLA/SLO promise. Our pilot packages have consistently been taking around 3-6 minutes 2E2.
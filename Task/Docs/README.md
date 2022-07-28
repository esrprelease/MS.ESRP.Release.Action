# Integrating the ESRP Package Release Github Action into your Github Repository  Workflow
After you are onboarded to ESRP and ESRP Release, you may continue onto this section.
The information here is deliberately detailed, if you are experienced in the process you may wish to pick out the pertinent configuration details.

## Why it matters
The Github Action performs all the actions required to successfully create and submit the package files to the ESRP package release service. This includes:
- Generating a Zip file including the files mentioned in the repository
- Uploading that zip file to a blob store location accessible to ESRP
- Submits a valid ESRP request 
- Track the request progress on regular pre-defined interval

## Pre-Requisites 
To configure the Github Action, you will need to:
- Create an app registration in the Microsoft Azure Active Directory (AAD App ID) 
- Create an authentication key (Secret associated with app registered) for the AAD App ID (we recommend doing this during Github Action configuration).
- The PRSS Authentication Certificate [ESRP Information - Set up Certificate Based Authentication (sharepoint.com)](https://microsoft.sharepoint.com/teams/prss/esrp/info/ESRP%20Onboarding%20Wiki/Set%20up%20Certificate%20Based%20Authentication.aspx) + Signing Certificate [ESRP Information - Generating the ESRP Authentication (Request Signing) certificate (sharepoint.com)](https://microsoft.sharepoint.com/teams/prss/esrp/info/ESRP%20Onboarding%20Wiki/Generating%20the%20ESRP%20Authentication%20(Request%20Signing)%20certificate.aspx)

 
If you have not completed the above, please go back and follow the instructions on the [main Wiki page](https://microsoft.sharepoint.com/teams/prss/esrp/info/ESRP%20Onboarding%20Wiki/ESRP%20Onboarding%20Guide%20Wiki.aspx)

## ​High Level Steps
1. Add the action in your workflow - you WILL need to use latest version of  Action – this action is available in Marketplace. 
2. Create an App registration in Azure Active Directory. 
3. Add App registration service principal to the Access policies of the AKV where the certificates reside. 
4. Add and configure the ESRP Release Task in your pipeline, along with the Service connection which will be leveraged by Github Action to communicate with ESRP.	


## Detailed Step by Step Guide 
The following are the detailed steps with embedded screenshots to provide additional clarification if required.  
1. Install the github Action 

- Click on Marketplace and search [Github Action](https://github.com/marketplace/actions/test-action-solution)

<img width="500" alt="Marketplace" src="Docs/Resource/Marketplace.png">

- Copy the given snippet in your .yml file as shown below.

<img width="500" alt="Marketplace" src="Docs/Resource/GithubAction.png">

2.  Create the App Registration in AAD

- Navigate to the AAD section in the Azure portal. Make sure you are logged in into the right Tenant, where the AKV exists with the certificates) (AME/Microsoft/PME etc.). 
- Click on App registration. 
- Click on ‘+’ button as highlighted on the right and create a new App registration. 
- You will need this application details in the next steps to enable service connection in the Github Action and to add this app to the access policies of the Azure key vault where the certificates reside. 

<img width="500" heigth="100" alt="Marketplace" src="Docs/Resource/Workflow.png">

<img width="500" alt="Marketplace" src="Docs/Resource/Action.png">

3.  Allowing App registration done in previous step to access the Azure key Vault 

- Before you configure your Github workflow you will need to enable the App registered in the last step to be allowed to access the Azure key vault for fetching the certificates at the runtime. 
- Go to the Azure portal and navigate to the Key vault where certificates are kept for auto rotation. 
- Find the section “Access Policies” and then click on ‘+ Access Policy’
- Give limited permission to the App registered. Only requirement is to Get and List certificates as well as Get and List Secrets. 

<img width="500" alt="Marketplace" src="Docs/Resource/SecretsHome.png">

<img width="500" alt="Marketplace" src="Docs/Resource/ActionSecret.png">

4. a. Enabling the Service Connection for Github Action.

### Generate the AAD APP secret (key) 
Follow the Instructions [Creating the Authentication key for the AAD App ID](https://microsoft.sharepoint.com/teams/prss/esrp/info/ESRP%20Onboarding%20Wiki/Creating%20the%20Authentication%20key%20for%20the%20AAD%20App%20ID.aspx)​ to generate a key for the AAD app registered in Step 2. 
 
Once the key is created do not navigate away from the Azure Portal window but leave the window open so you can copy the key.  
  
In ‘Service Connections’ section of the ADO select "New Service Endpoint". Find “ESRP Release Publishing”. The screen shot of the dialogue to the right shows the values to be set as follows: 

- Server URL - Value: [https://login.microsoftonline.com](https://login.microsoftonline.com)
- AAD APP ID: The App ID GUID you created for connecting to the AKV 
- AAD APP Secret - This is the key you generated above (this expires in 2 years, and will need to be manually updated) 
- ADD Application Tenant ID – Tenant Id where the AKV resides. 
- Key Vault name – Where the Authentication & Signing certificate reside to communicate to ESRP system. 
- Auth Cert name in key vault – Name by which the authentication certificate is stored in the AKV. 
- Sign Cert name in key vault - Name by which the payload signing certificate is stored in the AKV. (For task to work as expected, keep the signing cert name the same as the client id on boarded to ESRP System, as it will be considered as the Client id equivalent) 
- ​Connection Name – This is a value you define that will be recognizable to you. 
Select “OK” or “Save” to create the end point 

<img width="500" alt="Marketplace" src="Docs/Resource/GithubSecrets.png">

<img width="500" alt="Marketplace" src="Docs/Resource/Secrets.png">


4. b. Integrate the ESRP Package Release Github Action into your workflow 
 
- The assumption here is that you have most of the build defined and are simply adding the package release step​ into your build.  
- An important point to note, it is possible that you want to invoke ESRP several times in your build. If you configure a task once and then clone this task you can limit the amount of repeated configuration required.   
- In your Build select (+) sign to add a task 
- Search or scroll down to select the ESRP Package release task 
- The Image on the right is a screen shot of the configuration window as it opens with the example content. The following notes reference this image.  
* Task Version - leave as default 
* Display Name - this is freeform and should be meaningful to you especially if you are calling ESRP multiple times in your build 
* Connection Name - Please reference Step 4.a above. 
* Intent - The Intent for using this task. Ex: PackageDistribution. 
* Content Type – The type of content in the payload files. Ex: Maven, NuGet, etc. 
* Package file location – Location where the package files exist  
* Owners - multiple owners can be added. 
* Approvers - this feature is not available, and packages are auto approved. However minimum 1 approver is mandatory. 

<img width="500" alt="Marketplace" src="Docs/Resource/Inputs.png">
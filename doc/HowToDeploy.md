# How to deploy  
We use "https://app-cc-home.demo-fi.personium.io/" in this example, but make sure you use your own HomeApp Cell URL.  

## Before deploying  
Download the [zip file](/app-cc-home-clone.zip).  

## Deploying the files  
For similar screen shots of Unit Manager, please refer to the [How to deploy](https://github.com/personium/template-app-cell/blob/master/doc/HowToDeploy.md) of template-app-cell.  

1. Use Unit Manager to access your Personium Unit.  
1. Create an empty Cell (e.g. app-cc-home).
1. Use Unit Manager to access your app Cell.  
1. From Snapshot menu, click the "Upload" button, select the previous downloaded zip file to upload.  
1. From Snapshot menu, select the file and then click the "Import" button.   
You will be logged out automatically so that you will not be able to corrupt the Cell content.  
If your browser displays error message, ignore it and reload the page.  
1. Wait for a minute and then Re-login.  
    - If you are using your Personium Unit, login as Unit Admin and set your app Cell's password again.  
1. Select your HomeApp Cell and display the details of the main box.  
1. Specify the app Cell URL in the following files:  
    1. Download, modify then upload the main/[index.html](https://github.com/personium/app-cc-home/blob/master/index.html#L39)  
        - Format:  

                39: var appUnitFQDN = "{your FQDN}";

                52: homeAppUrl = "https://" + appUnitFQDN + "/{your cellname}/";

                54: homeAppUrl = "https://{your cellname}." + appUnitFQDN + "/";

                57: homeAppUrl = "https://" + appUnitFQDN + "/{your cellname}/";

        - Before:  

                39: var appUnitFQDN = "demo.personium.io";

                52: homeAppUrl = "https://" + appUnitFQDN + "/app-cc-home/";

                54: homeAppUrl = "https://app-cc-home." + appUnitFQDN + "/";

                57: homeAppUrl = "https://" + appUnitFQDN + "/app-cc-home/";

        - After (example):  

                39: var appUnitFQDN = "demo-fi.personium.io";

                52: homeAppUrl = "https://" + appUnitFQDN + "/app-cc-home/";

                54: homeAppUrl = "https://app-cc-home." + appUnitFQDN + "/";

                57: homeAppUrl = "https://" + appUnitFQDN + "/app-cc-home/";


1. Specify the app Cell URL in the following files:  
    1. Download, modify then upload the main/[index.html](https://github.com/personium/app-cc-home/blob/master/index.html#L40)  
        - Format:  

                40: var appMarketListEndpoint = "https://{Market cell url}/__/applist/Apps";

        - Before:  

                40: var appMarketListEndpoint = "https://demo.personium.io/market/__/applist/Apps";

        - After (example):  

                40: var appMarketListEndpoint = "https://market.demo-fi.personium.io/__/applist/Apps";
                

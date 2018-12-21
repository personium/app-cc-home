# How to deploy  
We use "https://demo.personium.io/app-cc-home/" in this example, but make sure you use your own Personium Cell URL.  

## Before deploying the App  
1. Join our community through [Slack](https://docs.google.com/forms/d/e/1FAIpQLSeup_VHnO09yB0r-pfQuQPSZkxZrVsisiFlSuNf0MPnUFKKGw/viewform?c=0&w=1)  
1. After your slack account is activated, please write a simple message in "demo-Cell-request" channel so that we will create a new Cell for you.  
You also need to mention that you want an app Cell, too.  
1. Once you receive your newly created app Cell, please change the password of the admin account.  

## Deploying the files  
1. Use Cell Manager to access your app Cell.  
1. From Snapshot menu, upload and then Import the [zip file](/app-cc-home-clone.zip)  
You will be logged out automatically so that you will not be able to corrupt the Cell content.  
If your browser displays error message, ignore it and reload the page.
1. When the app Cell is ready, the login page will be displayed.  Re-login.  
1. Display the details of the Box - app by clicking it.  
1. Modify the schema url.    
1. Specify the app Cell URL in the following files:  
    1. main/html/index.html  
        - Before:  

                39: var appUnitFQDN = "demo.personium.io";

                51: homeAppUrl = "https://" + appUnitFQDN + "/app-cc-home/";

                53: homeAppUrl = "https://app-cc-home." + appUnitFQDN + "/";

        - After (example):  

                39: var appUnitFQDN = "{your FQDN}";

                51: homeAppUrl = "https://" + appUnitFQDN + "/{your cellname}/";

                53: homeAppUrl = "https://{your cellname}." + appUnitFQDN + "/";
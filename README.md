# Description  
HomeApp is a GUI tool that helps you manage your profile, social network and Personium apps.  
This repository contains the necessary files (HTML, CSS, JavaScript) needed to create a copy of our official HomeApp.  

The latest version supports the following modes.  

1. Global mode - User must enter the target Cell URL manually and then log　in.  
HomeApp is already running in [an App Cell in the Demo environment](https://demo.personium.io/HomeApplication/__/box-resources/login.html?mode=global&lng=en).  
1. Local/Cell mode - User can log　in directly to the target Cell (target Cell URL is included in the login page URL).  

# Files to be modified and uploaded to your HomeApp Cell  

    │          
    └─ index.html

# Before you start  
Make sure you have Unit Admin level permission.  

Due to current implemetation of Personium Core, the followings will happen and require you to re-login as Unit Admin.  

1. The app Cell's user account will be overwritten with random password when importing a Cell from another Personium Unit.  
1. Unit/Cell Manager will be logged out automatically after importing a Cell.  

# How to deploy  
Follow the steps described in [How to deploy](doc/HowToDeploy.md) to import the Cell, customize and install your Personium HomeApp.  
`
# Google Login  
HomeApp allows user to login using Google authentication.  

## App Developer  
If you want to deploy your own HomeApp which supports Google Login, make sure you perform the following procedures.  

1. Access the following URL to create your own OAuth 2.0 Client ID.   
`https://console.developers.google.com/`

1. Replace the client_id's value in [this line](https://github.com/personium/app-cc-home/blob/master/html/js/login.js#L123) with your Client ID.  

## User  
1. From the hamburger button, click "Account".  
1. Click "Create Account".  
1. Click "Google".  
1. Enter email address.  
1. Click "Register".  

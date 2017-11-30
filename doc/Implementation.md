## What should be in the App Cell and user's Box  
Put images, CSS and JS should be included in the App Cell.  
All HTML should be included in the bar file so that all the files are installed in the user's box.  

- To avoid upgrading the version of the Box whenever a feature is added, it would be better to put implementation in the App Cell.  
- With same-origin policy in mind, HTML files should be in the user's box which is created by installing the App's bar file.  
- Implement each feature in a single HTML file (user's Box) and JS files (App Cell) to maintain robustness.  
- Refactor CSS and JS as often as possible.

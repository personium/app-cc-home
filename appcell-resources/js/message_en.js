var mg = {};
mg.msgStr = new Array();

// WORD
mg.msgStr["00001"] = "Settings";
mg.msgStr["00002"] = "Edit Account";
mg.msgStr["00003"] = "edit";
mg.msgStr["00004"] = "del";
mg.msgStr["00005"] = "Assigning Roles";
mg.msgStr["00006"] = "Delete Assigning Role";
mg.msgStr["00007"] = "Delete Account";
mg.msgStr["00008"] = "Delete Role";
mg.msgStr["00009"] = "Social";
mg.msgStr["00010"] = "Edit Profile";
mg.msgStr["00011"] = "Change Password";
mg.msgStr["00012"] = "Logout";
mg.msgStr["00013"] = "Display Name";
mg.msgStr["00014"] = "Description";
mg.msgStr["00015"] = "Profile Image";
mg.msgStr["00016"] = "Re-Login";
mg.msgStr["00017"] = "Edit Relation";
mg.msgStr["00018"] = "Delete External Cell";
mg.msgStr["00019"] = "Delete Assigning Relation";
mg.msgStr["00020"] = "Delete Relation";
mg.msgStr["00021"] = "Assigning Relations";
mg.msgStr["00022"] = "Add External Cell";
mg.msgStr["00023"] = "Independent";
mg.msgStr["00024"] = "Create External Cell";
mg.msgStr["00025"] = "Add Role";
mg.msgStr["00026"] = "Menu";
mg.msgStr["00027"] = "Document";
mg.msgStr["00028"] = "Account";
mg.msgStr["00029"] = "Detach";
mg.msgStr["00030"] = "Create Role";
mg.msgStr["00031"] = "Create Account";
mg.msgStr["00032"] = "Role";
mg.msgStr["00033"] = "Relation";
mg.msgStr["00034"] = "Create Relation";
mg.msgStr["00035"] = "Name";
mg.msgStr["00036"] = "Password";
mg.msgStr["00037"] = "Watch public BOX";
mg.msgStr["00038"] = "Role list";
mg.msgStr["00039"] = "Application";
mg.msgStr["00040"] = "Install";
mg.msgStr["00041"] = "Uninstall";
mg.msgStr["00042"] = "Details";
mg.msgStr["00043"] = "Edit Role";

// INFO
mg.msgStr["I0001"] = "You have successfully changed your password!<br>Please login again.";
mg.msgStr["I0002"] = "Log out?";
mg.msgStr["I0003"] = "Confirm (type new password again)";
mg.msgStr["I0004"] = "Please enter the account name.";
mg.msgStr["I0005"] = "New Password (6 to 32 Character, Character Type(Half Size Alphanumeric, \'-\', \'_\'))";
mg.msgStr["I0006"] = "Changes in the content that you enter. Is it OK?";
mg.msgStr["I0007"] = "Remove the association between this role( (1):(2) ). Is it OK?";
mg.msgStr["I0008"] = "You want to delete this account ( (1) ). Is it OK?";
mg.msgStr["I0009"] = "You want to delete this role ( (1):(2) ). Is it OK?";
mg.msgStr["I0010"] = "You want to delete this external cell ( (1) ). Is it OK?";
mg.msgStr["I0011"] = "External cell URL must end with '/'";
mg.msgStr["I0012"] = "Remove the association between this relation( (1):(2) ). Is it OK?";
mg.msgStr["I0013"] = "You want to delete this relation ( (1):(2) ). Is it OK?";
mg.msgStr["I0014"] = "Please select the role to assign.";
mg.msgStr["I0015"] = "Assign Role (s)";
mg.msgStr["I0016"] = "Box used for relation";
mg.msgStr["I0017"] = "Select a Box that this role is to use";
mg.msgStr["I0018"] = "Assign (s)";
mg.msgStr["I0019"] = "You do not have view permission.";
mg.msgStr["I0020"] = "Perform the installation. Is it OK?";

// WARNING
mg.msgStr["W0001"] = "Expiration date of the session has expired.<br>Please login again.";

// ERROR
mg.msgStr["E0001"] = "Account name or password is incorrect.";
mg.msgStr["E0002"] = "Password do not match. Please enter the correct password.";
mg.msgStr["E0003"] = "Please enter name";
mg.msgStr["E0004"] = "Name cannot exceed 128 characters";
mg.msgStr["E0005"] = "Special characters: only “-” & “_” are allowed";
mg.msgStr["E0006"] = "Name can not start with special character";
mg.msgStr["E0007"] = "Please enter valid schema URL";
mg.msgStr["E0008"] = "URL cannot exceed 1024 characters";
mg.msgStr["E0009"] = "Domain name cannot start with special character";
mg.msgStr["E0010"] = "Please enter a password.";
mg.msgStr["E0011"] = "Invalid URL";
mg.msgStr["E0012"] = "Please enter between 6 to 32 characters.";
mg.msgStr["E0013"] = "Please enter Character Type(Half Size Alphanumeric, '-', '_')";
mg.msgStr["E0014"] = "Please select a role.";
mg.msgStr["E0015"] = "Please select a relation.";
mg.msgStr["E0016"] = "Please Select Box";
mg.msgStr["E0017"] = "Please enter external cell name";
mg.msgStr["E0018"] = "Please enter valid external cell URL";
mg.msgStr["E0019"] = "External cell name cannot exceed 128 characters";
mg.msgStr["E0020"] = "External cell name cannot start with special character";
mg.msgStr["E0021"] = "Size cannot exceed 51200 characters";
mg.msgStr["E0022"] = "The target cell does not exist.";

mg.getMsg = function(id) {
    var str = "";
    if (mg.msgStr[id] != undefined) {
        str = mg.msgStr[id];
    }

    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            str = str.replace(new RegExp("\\(" + i + "\\)"), arguments[i]);
        }
    }
    return str;
}
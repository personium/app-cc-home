var msgStr = new Array();

// WORD
msgStr["00001"] = "Settings";
msgStr["00002"] = "Edit Account";
msgStr["00003"] = "edit";
msgStr["00004"] = "del";
msgStr["00005"] = "Assigning Roles";
msgStr["00006"] = "Delete Assigning Role";
msgStr["00007"] = "Delete Account";
msgStr["00008"] = "Delete Role";
msgStr["00009"] = "Social";
msgStr["00010"] = "Edit Profile";
msgStr["00011"] = "Change Password";
msgStr["00012"] = "Logout";
msgStr["00013"] = "Display Name";
msgStr["00014"] = "Description";
msgStr["00015"] = "Profile Image";
msgStr["00016"] = "Re-Login";
msgStr["00017"] = "Edit Relation";
msgStr["00018"] = "Delete External Cell";
msgStr["00019"] = "Delete Assigning Relation";
msgStr["00020"] = "Delete Relation";
msgStr["00021"] = "Assigning Relations";
msgStr["00022"] = "Add External Cell";
msgStr["00023"] = "Independent";
msgStr["00024"] = "Create External Cell";
msgStr["00025"] = "Add Role";
msgStr["00026"] = "Menu";
msgStr["00027"] = "Document";
msgStr["00028"] = "Account";
msgStr["00029"] = "Detach";
msgStr["00030"] = "Create Role";
msgStr["00031"] = "Create Account";
msgStr["00032"] = "Role";
msgStr["00033"] = "Relation";
msgStr["00034"] = "Create Relation";
msgStr["00035"] = "Name";
msgStr["00036"] = "Password";
msgStr["00037"] = "Watch public BOX";
msgStr["00038"] = "Role list";
msgStr["00039"] = "Application";
msgStr["00040"] = "Install";
msgStr["00041"] = "Uninstall";
msgStr["00042"] = "Details";
msgStr["00043"] = "Edit Role";

// INFO
msgStr["I0001"] = "You have successfully changed your password!<br>Please login again.";
msgStr["I0002"] = "Log out?";
msgStr["I0003"] = "Confirm (type new password again)";
msgStr["I0004"] = "Please enter the account name.";
msgStr["I0005"] = "New Password (6 to 32 Character, Character Type(Half Size Alphanumeric, \'-\', \'_\'))";
msgStr["I0006"] = "Changes in the content that you enter. Is it OK?";
msgStr["I0007"] = "Remove the association between this role( (1):(2) ). Is it OK?";
msgStr["I0008"] = "You want to delete this account ( (1) ). Is it OK?";
msgStr["I0009"] = "You want to delete this role ( (1):(2) ). Is it OK?";
msgStr["I0010"] = "You want to delete this external cell ( (1) ). Is it OK?";
msgStr["I0011"] = "External cell URL must end with '/'";
msgStr["I0012"] = "Remove the association between this relation( (1):(2) ). Is it OK?";
msgStr["I0013"] = "You want to delete this relation ( (1):(2) ). Is it OK?";
msgStr["I0014"] = "Please select the role to assign.";
msgStr["I0015"] = "Assign Role (s)";
msgStr["I0016"] = "Box used for relation";
msgStr["I0017"] = "Select a Box that this role is to use";
msgStr["I0018"] = "Assign (s)";
msgStr["I0019"] = "You do not have view permission.";
msgStr["I0020"] = "Perform the installation. Is it OK?";

// WARNING
msgStr["W0001"] = "Expiration date of the session has expired.<br>Please login again.";

// ERROR
msgStr["E0001"] = "Account name or password is incorrect.";
msgStr["E0002"] = "Password do not match. Please enter the correct password.";
msgStr["E0003"] = "Please enter name";
msgStr["E0004"] = "Name cannot exceed 128 characters";
msgStr["E0005"] = "Special characters: only “-” & “_” are allowed";
msgStr["E0006"] = "Name can not start with special character";
msgStr["E0007"] = "Please enter valid schema URL";
msgStr["E0008"] = "URL cannot exceed 1024 characters";
msgStr["E0009"] = "Domain name cannot start with special character";
msgStr["E0010"] = "Please enter a password.";
msgStr["E0011"] = "Invalid URL";
msgStr["E0012"] = "Please enter between 6 to 32 characters.";
msgStr["E0013"] = "Please enter Character Type(Half Size Alphanumeric, '-', '_')";
msgStr["E0014"] = "Please select a role.";
msgStr["E0015"] = "Please select a relation.";
msgStr["E0016"] = "Please Select Box";
msgStr["E0017"] = "Please enter external cell name";
msgStr["E0018"] = "Please enter valid external cell URL";
msgStr["E0019"] = "External cell name cannot exceed 128 characters";
msgStr["E0020"] = "External cell name cannot start with special character";
msgStr["E0021"] = "Size cannot exceed 51200 characters";

function getMsg(id) {
    var str = "";
    if (msgStr[id] != undefined) {
        str = msgStr[id];
    }

    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            str = str.replace(new RegExp("\\(" + i + "\\)"), arguments[i]);
        }
    }
    return str;
}
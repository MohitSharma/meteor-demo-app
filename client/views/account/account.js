Template.account.onRendered(function(){
    var validator = $('.updatePassword').validate({
    submitHandler: function(event){
        var oldPassword = $('[name=old]').val();
        var newPassword = $('[name=new]').val();
        var confirmPassword = $('[name=confirm]').val();
        Accounts.changePassword(oldPassword, newPassword, function(error){
            if(error){
                console.log("Error");
            } else {
                console.log("Done");
            }
        });
    }
    });
});
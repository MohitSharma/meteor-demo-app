// Registration
Template.register.events({
    'submit form': function(event){
        event.preventDefault();
        //var email = $('[name=email]').val();
        //var password = $('[name=password]').val();
        //Accounts.createUser({
        //  email: email,
        //  password: password
        //},function(error){
        //  if(error){
        //    console.log(error.reason); // Output error if registration fails
        //  } else {
        //    Router.go("home"); // Redirect user if registration succeeds
        //  }
        //});
    }
});

Template.register.onRendered(function(){
    var validator = $('.register').validate({
        submitHandler: function(event){
            var email = $('[name=email]').val();
            var username = $('[name=username]').val();
            var password = $('[name=password]').val();
            var name = $('#fullName').val();
            Accounts.createUser({
                username: username,
                email: email,
                password: password,
                profile: {name: name}
            }, function(error){
                if(error){
                    if(error.reason == "Email already exists."){
                        validator.showErrors({
                            email: "That email already belongs to a registered user."
                        });
                    }
                } else {
                    Router.go("home");
                }
            });
        }
    });
});
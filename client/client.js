$.validator.setDefaults({
    rules: {
        email: {
            required: true,
            email: true
        },
        username: {
            required: true
        },
        password: {
            required: true,
            minlength: 6
        }
    },
    messages: {
        username: {
            required: "You must enter username."
        },
        email: {
            required: "You must enter an email address.",
            email: "You've entered an invalid email address."
        },
        password: {
            required: "You must enter a password.",
            minlength: "Your password must be at least {0} characters."
        }
    }
});

//Logout

Template.navigation.events({
    'click .logout': function(event){
        event.preventDefault();
        Meteor.logout();
        Router.go('login');
    }
});

Meteor.startup(function() {
    Meteor.subscribe('emojis');
    Meteor.subscribe("users");
});
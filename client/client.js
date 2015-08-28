$.validator.setDefaults({
    rules: {
        email: {
            required: true,
            email: true
        },
        password: {
            required: true,
            minlength: 6
        }
    },
    messages: {
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

//Handling Todos

Template.todos.helpers({
    'todo': function(){
        var currentList = this._id;
        var currentUser = Meteor.userId();
        return Todos.find({listId: currentList, createdBy: currentUser}, {sort: {createdAt: -1}});
    }
});

Template.todoItem.helpers({
    'checked': function(){
        var isCompleted = this.completed;
        if(isCompleted){
            return "checked";
        } else {
            return "";
        }
    }
});

Template.projectLists.events({
    'click .delete-list': function(event){
        event.preventDefault();
        var documentId = this._id;
        var confirm = window.confirm("Delete this list?");
        if(confirm) {
            Meteor.call('removeList', documentId);
        }
    }
});

Template.todosCount.helpers({
    completedCount: function () {
        var currentList = this._id;
        var currentUser = Meteor.userId();
        return Todos.find({listId: currentList, completed: true, createdBy:currentUser}).count();
    },
    totalTodos: function () {
        var currentList = this._id;
        var currentUser = Meteor.userId();
        return Todos.find({listId: currentList, createdBy:currentUser}).count();
    }
});

Template.addTodo.events({
    'submit form': function(event){
        event.preventDefault();
        var todoName = $('[name="todoName"]').val();
        var currentList = this._id;
        Meteor.call('createListItem', todoName, currentList, function(error, results){
            if(error){
                console.log(error.reason);
            } else {
                $('[name="todoName"]').val('');
            }
        });
    }
});

Template.todoItem.events({
    'click .delete-todo': function(event){
        event.preventDefault();
        var documentId = this._id;
        var confirm = window.confirm("Delete this task?");
        if(confirm) {
            Meteor.call('removeListItem', documentId);
        }
    },
    'keyup [name=todoItem]': function(event) {
        if (event.which==13 || event.which == 27) {
            $(event.target).blur();
            console.log("Saved");
        }
        else {
            var documentId = this._id;
            var todoItem = $(event.target).val();
            Meteor.call('updateListItem', documentId, todoItem);
            console.log("Task changed to: " + todoItem);
        }
    },
    'change [type=checkbox]': function(){
        var documentId = this._id;
        var isCompleted = this.completed;
        if(isCompleted){
            Meteor.call('changeItemStatus', documentId, false);
        } else {
            Meteor.call('changeItemStatus', documentId, true);
        }
    }
});


//Handling Lists

Template.projectLists.helpers({
    'list': function(){
        var currentUser = Meteor.userId();
        return Lists.find({createdBy: currentUser}, {sort: {name: 1}});
    }
});

//Template Level Subscriptions

Template.projectLists.onCreated(function () {
    this.subscribe('lists');
});


Template.addList.events({
    'submit form': function(event){
        event.preventDefault();
        var listName = $('[name=listName]').val();
        Meteor.call('createNewList', listName, function(error, results){
            if(error){
                console.log(error.reason);
            } else {
                Router.go('listPage', { _id: results });
                $('[name=listName]').val('');
            }
        });
    }
});

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
    $('.register').validate({
        submitHandler: function(event){
            var email = $('[name=email]').val();
            var password = $('[name=password]').val();
            Accounts.createUser({
                email: email,
                password: password
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

//Logout

Template.navigation.events({
    'click .logout': function(event){
        event.preventDefault();
        Meteor.logout();
        Router.go('login');
    }
});
//Login
Template.login.events({
    'submit form': function(event){
        event.preventDefault();
        //var email = $('[name=email]').val();
        //var password = $('[name=password]').val();
        //Meteor.loginWithPassword(email, password, function(error){
        //  if(error){
        //    console.log(error.reason);
        //  } else {
        //    var currentRoute = Router.current().route.getName();
        //    if(currentRoute == "login"){
        //      Router.go("home");
        //    }
        //  }
        //});
    }
});

Template.login.onRendered(function(){
    $('.login').validate({
        submitHandler: function(event){
            var email = $('[name=email]').val();
            var password = $('[name=password]').val();
            Meteor.loginWithPassword(email, password, function(error){
                if(error){
                    if(error.reason == "User not found"){
                        validator.showErrors({
                            email: "That email doesn't belong to a registered user."
                        });
                    }
                    if(error.reason == "Incorrect password"){
                        validator.showErrors({
                            password: "You entered an incorrect password."
                        });
                    }
                } else {
                    var currentRoute = Router.current().route.getName();
                    if(currentRoute == "login"){
                        Router.go("home");
                    }
                }
            });
        }
    });
});

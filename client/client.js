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

//Handling Tasks

Template.tasks.helpers({
    'task': function(){
        var currentProject = this._id;
        var currentUser = Meteor.userId();
        return Tasks.find({projectId: currentProject, createdBy: currentUser}, {sort: {createdAt: -1}});
    }
});

Template.taskItem.helpers({
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
            Meteor.call('removeProject', documentId);
        }
    }
});

Template.tasksCount.helpers({
    completedCount: function () {
        var currentProject = this._id;
        var currentUser = Meteor.userId();
        return Tasks.find({listId: currentProject, completed: true, createdBy:currentUser}).count();
    },
    totalTasks: function () {
        var currentProject = this._id;
        var currentUser = Meteor.userId();
        return Tasks.find({listId: currentProject, createdBy:currentUser}).count();
    }
});

Template.addTask.events({
    'submit form': function(event){
        event.preventDefault();
        var taskName = $('[name="taskName"]').val();
        var currentProject = this._id;
        Meteor.call('createProjectItem', taskName, currentProject, function(error, results){
            if(error){
                console.log(error.reason);
            } else {
                $('[name="taskName"]').val('');
            }
        });
    }
});

Template.taskItem.events({
    'click .delete-task': function(event){
        event.preventDefault();
        var documentId = this._id;
        var confirm = window.confirm("Delete this task?");
        if(confirm) {
            Meteor.call('removeProjectItem', documentId);
        }
    },
    'keyup [name=taskItem]': function(event) {
        if (event.which==13 || event.which == 27) {
            $(event.target).blur();
            console.log("Saved");
        }
        else {
            var documentId = this._id;
            var taskItem = $(event.target).val();
            Meteor.call('updateProjectItem', documentId, taskItem);
            console.log("Task changed to: " + taskItem);
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


//Handling Projects

Template.projectLists.helpers({
    'projects': function(){
        var currentUser = Meteor.userId();
        return Projects.find({createdBy: currentUser}, {sort: {name: 1}});
    }
});

//Template Level Subscriptions

Template.projectLists.onCreated(function () {
    this.subscribe('projects');
});


Template.newProject.events({
    'submit form': function(event){
        event.preventDefault();
        var projectName = $('[name=projectName]').val();
        var projectLead = $('[name=projectLead]').val();
        Meteor.call('createNewProject', projectName, projectLead, function(error, results){
            if(error){
                console.log(error.reason);
            } else {
                Router.go('projectPage', { _id: results });
                $('[name=projectName]').val('');
            }
        });
    }
});


Template.newProject.helpers({
    settings: function() {
        return {
            position: "top",
            limit: 5,
            rules: [
                {
                    token: '',
                    collection: Meteor.users,
                    field: "username",
                    template: Template.userPill
                }
            ]
        };
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
    var validator = $('.login').validate({
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


//Chat Application
Template.chat.onCreated(function () {
    this.subscribe("projects");
    this.subscribe("messages");
});

Meteor.startup(function() {
    Meteor.subscribe('emojis');
    Meteor.subscribe("users");
});

Template.input.events({
    'click .sendMsg': function(e) {
        _sendMessage();
    },
    'keyup #msg': function(e) {
        if (e.type == "keyup" && e.which == 13) {
            _sendMessage();
        }
    },
    'click .emotions_menu': function(e) {
        Modal.show('emojiModal');
    }
});

_sendMessage = function() {
    var el = document.getElementById("msg");
    Meteor.call('insertMessage', el.value, Session.get("roomType"), Session.get('roomId'), function(error, results){
        if(error){
            console.log(error.reason);
        } else {
            el.value = "";
            el.focus();
            $('#messages').animate({scrollTop: $('#messages').prop("scrollHeight")}, 500);
        }
    });
};

Template.messages.helpers({
    messages: function() {
        if (Session.get("roomType") == "Person") {
            console.log("How many times", Session.get("roomId"));
            var currentUser = Meteor.userId();
            var roomId = defaultRoomId(Session.get("roomType"), Session.get("roomId"), currentUser);
            return Messages.find({roomId: roomId}, {sort: {ts: 1}});
        }
        else {
            return Messages.find({roomType: Session.get("roomType")}, {sort: {ts: 1}});
        }

    },
    roomname: function() {
        return Session.get("roomname");
    },
    roomType: function() {
        return Session.get("roomType");
    }
});

Template.message.helpers({
    timestamp: function() {
        return this.ts.toLocaleString();
    },
    deleteAllowed: function() {
        var currentUser = Meteor.userId();
        return this.sender === currentUser;
    }
});

Template.message.events({
    'click .delete-message': function(event){
        event.preventDefault();
        var documentId = this._id;
        var confirm = window.confirm("Delete this message?");
        if(confirm) {
            Meteor.call('removeMessage', documentId);
        }
    }
});


Template.rooms.events({
    'click li a': function(e) {
        Session.set("roomname", e.target.textContent);
    }
});

Template.rooms.helpers({
    rooms: function() {
        return Projects.find();
    }
});
Template.room.helpers({
    roomstyle: function() {
        return Session.equals("roomname", this.name) ? "font-weight: bold" : "";
    }
});


Template.persons.helpers({
    persons: function() {
        return Meteor.users.find({_id: {$ne: Meteor.userId()}});
    }
});

Template.person.helpers({
    personstyle: function() {
        return Session.equals("roomname", this.profile.name) ? "font-weight: bold" : "";
    }
});

Template.persons.events({
    'click li a': function(e) {
        Session.set("roomname", e.target.textContent);
    }
});


Template.emoji_menu.helpers({
    emoji_list: function() {
        return Emojis.find();
    }
});

Template.emoji_icon.events({
    'click a img': function(e) {
        var alias = e.target.alt;
        var text = document.getElementById("msg").value;
        text += ':'+alias+':';
        document.getElementById("msg").value = text;
        Modal.hide('emojiModal');
        document.getElementById("msg").focus();
    }
});


function defaultRoomId(roomType, roomId, currentUser) {
    if (roomType == 'Person') {
        var roomArray = [roomId, currentUser];
        roomArray.sort();
        return roomArray.join("_");
    }
    else {
        return roomId;
    }
}
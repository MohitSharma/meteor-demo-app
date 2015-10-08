Router.route('/register');
Router.route('/login');
Router.route('/', {
    name: "home",
    template: 'home'
});

Router.route('/account', {
    name: "account",
    template: 'account',
    data: function(){
        var currentUser = Meteor.userId();
        return currentUser;
    }
});

Router.route('/messages', {
    name: "messages",
    template: 'chat',
    data: function(){
        var currentUser = Meteor.userId();
        return currentUser;
    }
});

Router.route('/projects', {
    name: "projects",
    template: 'projectLists',
    data: function(){
        var currentUser = Meteor.userId();
        return currentUser;
    }
});

Router.route('/projects/new', {
    name: "newProject",
    template: 'newProject',
    data: function(){
        var currentUser = Meteor.userId();
        return currentUser;
    }
});

Router.route('/messages/:_id/project', {
    name: "messagesProject",
    template: 'chat',
    data: function(){
        Session.set("roomType", "Project");
        Session.set("roomId", this.params._id);
        var currentUser = Meteor.userId();
        return {user: currentUser, id: this.params._id};
    }
});

Router.route('/messages/:_id/personal', {
    name: "messagesPersonal",
    template: 'chat',
    data: function(){
        Session.set("roomType", "Person");
        Session.set("roomId", this.params._id);
        var currentUser = Meteor.userId();
        return {user: currentUser, id: this.params._id};
    }
});

Router.route('/projects/:_id', {
    name: 'projectPage',
    template: 'projectPage',
    data: function(){
        var currentProject = this.params._id;
        return Projects.findOne({_id: currentProject});
    },
    waitOn: function(){
        var currentProject = this.params._id;
        return [Meteor.subscribe('projects', currentProject), Meteor.subscribe('tasks', currentProject)];
    },
    onBeforeAction: function(){
        var currentUser = Meteor.userId();
        if(currentUser){
            this.next();
        } else {
            this.render("login");
        }
    }
});

Router.configure({
    layoutTemplate: 'main',
    loadingTemplate: 'loading'
});
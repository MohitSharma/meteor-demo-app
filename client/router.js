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

Router.route('/messages/:_id/project', {
    name: "messagesProject",
    template: 'chat',
    data: function(){
        Session.setDefault("roomname", "Project");
        var currentUser = Meteor.userId();
        return currentUser;
    }
});

Router.route('/messages/:_id/personal', {
    name: "messagesPersonal",
    template: 'chat',
    data: function(){
        Session.setDefault("roomname", "Person");
        var currentUser = Meteor.userId();
        return currentUser;
    }
});

Router.route('/list/:_id', {
    name: 'projectPage',
    template: 'projectPage',
    data: function(){
        var currentList = this.params._id;
        return Lists.findOne({_id: currentList});
    },
    waitOn: function(){
        var currentList = this.params._id;
        return [Meteor.subscribe('lists', currentList), Meteor.subscribe('todos', currentList)];
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
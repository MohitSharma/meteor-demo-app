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

Router.route('/list/:_id', {
    name: 'listPage',
    template: 'listPage',
    data: function(){
        var currentList = this.params._id;
        return Meteor.call("findList", currentList);
    },
    waitOn: function(){
        var currentList = this.params._id;
        return Meteor.subscribe('todos', currentList);
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
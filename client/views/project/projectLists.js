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
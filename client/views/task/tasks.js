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
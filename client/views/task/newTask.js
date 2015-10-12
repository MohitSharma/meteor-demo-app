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
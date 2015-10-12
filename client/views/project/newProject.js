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
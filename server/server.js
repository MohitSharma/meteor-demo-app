Meteor.publish('projects', function(){
    var currentUser = this.userId;
    return Projects.find({ createdBy: currentUser });
});

Meteor.publish('tasks', function(currentProject){
    var currentUser = this.userId;
    return Tasks.find({ createdBy: currentUser, projectId: currentProject })
});


Meteor.publish("rooms", function () {
    return Rooms.find();
});

Meteor.publish("messages", function () {
    return Messages.find({}, {sort: {ts: 1}});
});

Meteor.publish("users", function () {
    return Meteor.users.find({}, {
        fields: {
            username: 1,
            profile: 1
        }
    });
});

Meteor.publish('emojis', function() {
    // Here you can choose to publish a subset of all emojis
    // if you'd like to.
    return Emojis.find();
});


//Chat Application

Meteor.startup(function () {
    //Messages.remove({});
    //Rooms.remove({});
    //if (Rooms.find().count() === 0) {
    //    ["Meteor", "JavaScript", "Reactive", "MongoDB"].forEach(function(r) {
    //        Rooms.insert({roomname: r});
    //    });
    //}
});

//Chat App Ends Here




Meteor.methods({
    'createNewProject': function(projectName, projectLead){
        var currentUser = Meteor.userId();
        if(projectName == ""){
            projectName = defaultName(currentUser);
        }
        check(projectName, String);
        var data = {
            name: projectName,
            lead: projectLead,
            createdBy: currentUser
        }
        if(!currentUser){
            throw new Meteor.Error("not-logged-in", "You're not logged-in.");
        }
        else {
            return Projects.insert(data);
        }
    },
    'findProject': function(documentId){
        var currentUser = Meteor.userId();
        var data = {
            _id: documentId,
            createdBy: currentUser
        };
        if(!currentUser){
            throw new Meteor.Error("not-logged-in", "You're not logged-in.");
        }
        return Projects.findOne(data);
    },
    removeProject: function(documentId) {
        var currentUser = Meteor.userId();
        var data = {
            _id: documentId,
            createdBy: currentUser
        }
        if(!currentUser){
            throw new Meteor.Error("not-logged-in", "You're not logged-in.");
        }
        return Projects.remove(data);
    },
    'createProjectItem' : function(taskName, currentProject) {
        var currentUser = Meteor.userId();
        var data = {
            name: taskName,
            completed: false,
            createdAt: new Date(),
            createdBy: currentUser,
            projectId: currentProject
        }
        if(!currentUser){
            throw new Meteor.Error("not-logged-in", "You're not logged-in.");
        }
        var currentProject = Projects.findOne(currentProject);
        if(currentProject.createdBy != currentUser){
            throw new Meteor.Error("invalid-user", "You don't own that list.");
        }
        return Tasks.insert(data);

    },
    updateProjectItem : function(docuemntId, taskItem) {
        check(taskItem, String);
        var currentUser = Meteor.userId();
        var data = {
            _id: documentId,
            createdBy: currentUser
        }
        if(!currentUser){
            throw new Meteor.Error("not-logged-in", "You're not logged-in.");
        }
        return Tasks.update(data, {$set: { name: taskItem }});
    },
    changeItemStatus: function(documentId, status) {
        check(status, Boolean);
        var currentUser = Meteor.userId();
        var data = {
            _id: documentId,
            createdBy: currentUser
        }
        if(!currentUser){
            throw new Meteor.Error("not-logged-in", "You're not logged-in.");
        }
        return Tasks.update(data, {$set: {completed: status}});
    },
    removeProjectItem: function(documentId) {
        var currentUser = Meteor.userId();
        var data = {
            _id: documentId,
            createdBy: currentUser
        }
        if(!currentUser){
            throw new Meteor.Error("not-logged-in", "You're not logged-in.");
        }
        return Tasks.remove(data);
    },
    insertMessage: function(message, roomType, roomId) {
        var currentUser = Meteor.userId();
        var data = {
            user: Meteor.user().profile.name,
            msg: message,
            ts: new Date(),
            roomType: roomType,
            sender: currentUser,
            roomId: defaultRoomId(roomType, roomId, currentUser)
        };
        if(!currentUser){
            throw new Meteor.Error("not-logged-in", "You're not logged-in.");
        }
        return Messages.insert(data);
    },
    findPersonMessages: function(roomType, roomId) {
        var currentUser = Meteor.userId();
        if(!currentUser){
            throw new Meteor.Error("not-logged-in", "You're not logged-in.");
        }
        ;
        return Messages.find({roomId: defaultRoomId(roomType, roomId, currentUser)}).fetch();
    },
    removeMessage: function(documentId) {
        var currentUser = Meteor.userId();
        var data = {
            _id: documentId,
            sender: currentUser
        }
        if(!currentUser){
            throw new Meteor.Error("not-logged-in", "You're not logged-in.");
        }
        return Messages.remove(data);
    }
});

function defaultName(currentUser) {
    var nextLetter = 'A'
    var nextName = 'Project ' + nextLetter;
    while (Projects.findOne({ name: nextName, createdBy: currentUser })) {
        nextLetter = String.fromCharCode(nextLetter.charCodeAt(0) + 1);
        nextName = 'Project ' + nextLetter;
    }
    return nextName;
}

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

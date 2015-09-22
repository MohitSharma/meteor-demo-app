Meteor.publish('lists', function(){
    var currentUser = this.userId;
    return Lists.find({ createdBy: currentUser });
});

Meteor.publish('todos', function(currentList){
    var currentUser = this.userId;
    return Todos.find({ createdBy: currentUser, listId: currentList })
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
            profile: 1
        }
    });
});


//Chat Application

Meteor.startup(function () {
    //Messages.remove({});
    Rooms.remove({});
    //if (Rooms.find().count() === 0) {
    //    ["Meteor", "JavaScript", "Reactive", "MongoDB"].forEach(function(r) {
    //        Rooms.insert({roomname: r});
    //    });
    //}
});

//Chat App Ends Here




Meteor.methods({
    'createNewList': function(listName){
        var currentUser = Meteor.userId();
        if(listName == ""){
            listName = defaultName(currentUser);
        }
        check(listName, String);
        var data = {
            name: listName,
            createdBy: currentUser
        }
        if(!currentUser){
            throw new Meteor.Error("not-logged-in", "You're not logged-in.");
        }
        else {
            return Lists.insert(data);
        }
    },
    'findList': function(documentId){
        var currentUser = Meteor.userId();
        var data = {
            _id: documentId,
            createdBy: currentUser
        };
        if(!currentUser){
            throw new Meteor.Error("not-logged-in", "You're not logged-in.");
        }
        return Lists.findOne(data);
    },
    removeList: function(documentId) {
        var currentUser = Meteor.userId();
        var data = {
            _id: documentId,
            createdBy: currentUser
        }
        if(!currentUser){
            throw new Meteor.Error("not-logged-in", "You're not logged-in.");
        }
        return Lists.remove(data);
    },
    'createListItem' : function(todoName, currentList) {
        var currentUser = Meteor.userId();
        var data = {
            name: todoName,
            completed: false,
            createdAt: new Date(),
            createdBy: currentUser,
            listId: currentList
        }
        if(!currentUser){
            throw new Meteor.Error("not-logged-in", "You're not logged-in.");
        }
        var currentList = Lists.findOne(currentList);
        if(currentList.createdBy != currentUser){
            throw new Meteor.Error("invalid-user", "You don't own that list.");
        }
        return Todos.insert(data);

    },
    updateListItem : function(docuemntId, todoItem) {
        check(todoItem, String);
        var currentUser = Meteor.userId();
        var data = {
            _id: documentId,
            createdBy: currentUser
        }
        if(!currentUser){
            throw new Meteor.Error("not-logged-in", "You're not logged-in.");
        }
        return Todos.update(data, {$set: { name: todoItem }});
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
        return Todos.update(data, {$set: {completed: status}});
    },
    removeListItem: function(documentId) {
        var currentUser = Meteor.userId();
        var data = {
            _id: documentId,
            createdBy: currentUser
        }
        if(!currentUser){
            throw new Meteor.Error("not-logged-in", "You're not logged-in.");
        }
        return Todos.remove(data);
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
    }
});

function defaultName(currentUser) {
    var nextLetter = 'A'
    var nextName = 'List ' + nextLetter;
    while (Lists.findOne({ name: nextName, createdBy: currentUser })) {
        nextLetter = String.fromCharCode(nextLetter.charCodeAt(0) + 1);
        nextName = 'List ' + nextLetter;
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

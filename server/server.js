Meteor.publish('lists', function(){
    var currentUser = this.userId;
    return Lists.find({ createdBy: currentUser });
});

Meteor.publish('todos', function(currentList){
    var currentUser = this.userId;
    return Todos.find({ createdBy: currentUser, listId: currentList })
});

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
        }
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
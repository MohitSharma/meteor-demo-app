Template.chat.onCreated(function () {
    this.subscribe("projects");
    this.subscribe("messages");
});

Template.input.events({
    'click .sendMsg': function(e) {
        _sendMessage();
    },
    'keyup #msg': function(e) {
        if (e.type == "keyup" && e.which == 13) {
            _sendMessage();
        }
    },
    'click .emotions_menu': function(e) {
        Modal.show('emojiModal');
    }
});

_sendMessage = function() {
    var el = document.getElementById("msg");
    Meteor.call('insertMessage', el.value, Session.get("roomType"), Session.get('roomId'), function(error, results){
        if(error){
            console.log(error.reason);
        } else {
            el.value = "";
            el.focus();
            $('#messages').animate({scrollTop: $('#messages').prop("scrollHeight")}, 500);
        }
    });
};

Template.messages.helpers({
    messages: function() {
        if (Session.get("roomType") == "Person") {
            console.log("How many times", Session.get("roomId"));
            var currentUser = Meteor.userId();
            var roomId = defaultRoomId(Session.get("roomType"), Session.get("roomId"), currentUser);
            return Messages.find({roomId: roomId}, {sort: {ts: 1}});
        }
        else {
            return Messages.find({roomType: Session.get("roomType")}, {sort: {ts: 1}});
        }

    },
    roomname: function() {
        return Session.get("roomname");
    },
    roomType: function() {
        return Session.get("roomType");
    }
});

Template.message.helpers({
    timestamp: function() {
        return this.ts.toLocaleString();
    },
    deleteAllowed: function() {
        var currentUser = Meteor.userId();
        return this.sender === currentUser;
    }
});

Template.message.events({
    'click .delete-message': function(event){
        event.preventDefault();
        var documentId = this._id;
        var confirm = window.confirm("Delete this message?");
        if(confirm) {
            Meteor.call('removeMessage', documentId);
        }
    }
});


Template.rooms.events({
    'click li a': function(e) {
        Session.set("roomname", e.target.textContent);
    }
});

Template.rooms.helpers({
    rooms: function() {
        return Projects.find();
    }
});
Template.room.helpers({
    roomstyle: function() {
        return Session.equals("roomname", this.name) ? "font-weight: bold" : "";
    }
});


Template.persons.helpers({
    persons: function() {
        return Meteor.users.find({_id: {$ne: Meteor.userId()}});
    }
});

Template.person.helpers({
    personstyle: function() {
        return Session.equals("roomname", this.profile.name) ? "font-weight: bold" : "";
    }
});

Template.persons.events({
    'click li a': function(e) {
        Session.set("roomname", e.target.textContent);
    }
});


Template.emoji_menu.helpers({
    emoji_list: function() {
        return Emojis.find();
    }
});

Template.emoji_icon.events({
    'click a img': function(e) {
        var alias = e.target.alt;
        var text = document.getElementById("msg").value;
        text += ':'+alias+':';
        document.getElementById("msg").value = text;
        Modal.hide('emojiModal');
        document.getElementById("msg").focus();
    }
});


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
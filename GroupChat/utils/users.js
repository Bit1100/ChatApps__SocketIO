// Users collector
let users = [];
let rooms = [];

// Class for User Manipulation
class UserManip {
    // adding room to the rooms list
    static addRoom(room) {
        rooms.push(room);
        return room;
    }

    // adding user to the users list
    static addUser(id, username, room) {
        const user = { id, username, room };

        users.push(user);

        return user;
    }

    // finding specific user
    static getUser(id) {
        return users.find((user) => user.id === id);
    }

    // finding specific room
    static getRoom(room) {
        return {
            user: users.filter((user) => user.room === room),
            room: rooms.filter((roomName) => roomName === room),
        };
    }

    // All Users and Rooms
    static getAllRooms() {
        return { rooms };
    }

    // Getting deleted user
    static deleteUser(id) {
        const index = users.findIndex((user) => user.id === id);

        if (index !== -1) {
            return users.splice(index, 1)[0];
        }
    }
}

module.exports = UserManip;
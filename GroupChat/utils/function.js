// importing moment module for time
const moment = require("moment");

function formatMessage(username, message, sender) {
    return {
        sender,
        username,
        msg: message,
        time: moment().format("h:mm a"),
    };
}

module.exports = formatMessage;
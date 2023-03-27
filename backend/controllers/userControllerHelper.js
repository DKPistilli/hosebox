const toUsernameFormat = (name) => {
    if (!name) {
        return "";
    } else {
        var userName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    }
    return userName;
}

// basic username validation - must be minimum of 6 num/chars
const isValidUsername = (username) => {
    const usernameRegex = /^[a-zA-Z0-9]{6,}$/;
    return usernameRegex.test(username);
};

// basic email validation -- must be xyz@io with domain being min 2 chars.
const isValidEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
};

module.exports = {
    toUsernameFormat,
    isValidUsername,
    isValidEmail,
};

// helper fx, lowercase all chars but [0] index.
const lowerAllButFirstChar = (name) => {

    let username;

    if (!name) {
        username = "";
    } else if (name.length === 1) {
        username = name.toUpperCase();
    } else {
        username = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    }

    return username;
}

// basic username validation - must be minimum of 6 num/chars
const isValidUsername = (username) => {

    //handle too many characters
    const maxChars = 50;
    if (username.length > maxChars) {
        return false;
    }

    const usernameRegex = /^[a-zA-Z0-9]{5,}$/;
    return usernameRegex.test(username);
};

// basic email validation -- must be xyz@io with domain being min 2 chars.
const isValidEmail = (email) => {

    //handle too many characters
    const maxChars = 50;
    if (email.length > maxChars) {
        return false;
    }

    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
};

module.exports = {
    lowerAllButFirstChar,
    isValidUsername,
    isValidEmail,
};
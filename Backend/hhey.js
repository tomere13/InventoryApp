const bcrypt = require('bcrypt');

const password = 'hello123';
const saltRounds = 12;

bcrypt.hash(password, saltRounds, function(err, hash) {
    if (err) {
        console.error(err);
    } else {
        console.log("Hashed password:", hash);
    }
});
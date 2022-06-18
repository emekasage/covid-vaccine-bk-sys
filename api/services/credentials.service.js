import bcrypt from 'bcryptjs'

export const findAdminByCredentialsFunction = function (email, password) {
    var Model = this;

    return Model.findOne({ email }).then((instance) => {
        if (!instance) {
            return null;
        }

        return new Promise((resolve, reject) => {
            // Use bcrypt.compare to compare password and instance.password
            bcrypt.compare(password, instance.password, (err, res) => {
                if (res) {
                    resolve(instance);
                } else {
                    resolve(null);
                }
            });
        });
    });
};

/**
 * Users on this system only work with emails
 * @param {*} email : user's email
 * @returns user instance (could be null if not found)
 */
export const findUserByCredentialsFunction = function (email) {
    var Model = this;

    return Model.findOne({ email }).then((instance) => {
        resolve(instance)
    });
};


export const hashPasswordFunction = function (next) {
    var instance = this;

    if (instance.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(instance.password, salt, (err, hash) => {
                instance.password = hash;
                next();
            });
        });
    } else {
        next();
    }
}

export const generateVerificationCode = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 13);
}
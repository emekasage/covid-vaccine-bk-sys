import jwt from 'jsonwebtoken';

export const generateAuthTokenFunction = function (instance) {
    var access = 'auth';
    var token = jwt.sign({ _id: instance._id.toHexString(), access }, process.env.JWT_SECRET, {
    }).toString();
    return Promise.resolve(token);
}

export const generateUserAuthTokenFunction = function () {
    var instance = this;
    return generateAuthTokenFunction(instance);
}

export const generateAdminAuthTokenFunction = function () {
    var instance = this;
    return generateAuthTokenFunction(instance);
}

export const findByTokenFunction = async function (token) {
    var Model = this;
    var decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
        throw { errmsg: "A valid token is required" }
    }
    let instance = await Model.findOne({
        '_id': decoded._id,
    });
    return instance;
};
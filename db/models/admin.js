import mongoose from 'mongoose';
import _ from 'lodash';
import * as constants from '../../constants.js';
import * as JwtService from '../../api/services/jwt.service.js'
import * as CredentialsService from '../../api/services/credentials.service.js'

var AdminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 4,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        default: constants.BASIC_ADMIN_ROLE
    },
    creatorId: {
        type: String,
        trim: true,
        default: null
    },
    createdAt: {
        type: Number,
        default: new Date().getTime()
    },
    disabled : {
        type: Boolean,
        default: false
    }

});

AdminSchema.methods.toJSON = function () {
    var admin = this;
    var adminObject = admin.toObject();

    return _.pick(adminObject, ['_id', 'email', 'role', 'creatorId','createdAt','disabled']);
};

AdminSchema.methods.generateAuthToken = JwtService.generateAdminAuthTokenFunction;
AdminSchema.statics.findByToken = JwtService.findByTokenFunction;
AdminSchema.statics.findByCredentials = CredentialsService.findAdminByCredentialsFunction;
AdminSchema.pre('save', CredentialsService.hashPasswordFunction);

const AdminModel = mongoose.model('Admin', AdminSchema);
export default AdminModel;
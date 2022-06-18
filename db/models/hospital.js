import mongoose from 'mongoose';

var HospitalSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        unique: true
    },
    facilityId: {
        type: String,
        required: true,
        unique: true
    },
    state: {
        type: String,
        required: true,
        trim: true
    },
    lga: {
        type: String,
        required: true,
        trim: true,
    },

    // hospital inventory details
    pzifer: {
        type: Number,
        default: 0
    },
    moderna: {
        type: Number,
        default: 0
    },
    johnson: {
        type: Number,
        default: 0
    },
    novavax: {
        type: Number,
        default: 0
    },
    oxford: {
        type: Number,
        default: 0
    },
    // hospital inventory details ends here

    createdAt: {
        type: Date,
        default: new Date()
    }
});

const HospitalModel = mongoose.model('Hospital', HospitalSchema);
export default HospitalModel;
import mongoose from 'mongoose';

var BookingSchema = new mongoose.Schema({

    // User personal information
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 4,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 4,
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true,
        minlength: 4,
    },
    address: {
        type: String,
        trim: true,
        minlength: 4,
    },
    gender: {
        type: String,
        trim: true,
    },
    occupation: {
        type: String,
        trim: true,
    },
    dob: {
        type: String,
        trim: true,
    },
    idType: {
        type: String,
        required: true,
        minlength: 6,
        trim: true,
    },
    // User personal information ends here

    // Vaccination information
    dose: {
        type: String,
        required: true,
        trim: true,
    },
    vaccine: {
        type: String,
        required: true,
        trim: true,
    },
    hospitalId: {
        type: String,
        required: true 
    },
    date: {
        type: Date,
        required: true
    },
    sessionTime: {
        type: String,
        required: true 
    },
    // Vaccination information ends here

    // Additional booking information
    vacId: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: new Date()
    }
    // Additional booking information ends here
});

const BookingModel = mongoose.model('Booking', BookingSchema);
export default BookingModel;
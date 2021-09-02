const mongoose = require('mongoose');

const patientSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true
    },
    fullname: {
        type: String,
        required: true
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor'
    },
    age: {
        type: Number,
        validate: {
            validator: function (ageValue) {
                return ageValue >= 0 && ageValue <= 120
            },
            message: 'Age should be a number between 0 and 120.'
        }
    },
    visitDate: {
        type: Date,
        default: Date.now
    },
    caseDesc: {
        type: String,
        validate: {
            validator: function (desc) {
                return desc.length >= 10
            },
            message: 'Case description length must be greater than 10 characters'
        }
    }
});

module.exports = mongoose.model('Patient', patientSchema);
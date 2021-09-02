const mongoose = require('mongoose');

const doctorSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true
    },
    name: {
        firstName: {
            type: String,
            required: true
        },
        lastName: String
    },
    birthDate: Date,
    address: {
        state: {
            type: String,
            validate: {
                validator: function (stateVal) {
                    return stateVal.length >= 2 && stateVal.length <= 3
                },
                message: 'State should be between two and three characters.'
            }
        },
        suburb: String,
        street: String,
        unit: Number
    },
    numPatients: {
        type: Number,
        min: 0
    }
});

module.exports = mongoose.model('Doctor', doctorSchema);
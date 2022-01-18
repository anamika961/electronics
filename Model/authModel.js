const mongoose = require('mongoose');
const SchemaVariable = mongoose.Schema;

const RegistrationSchema = new SchemaVariable({
    Fname: {
        type: String,
        required: true
    },
    Lname: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true
    },
    Paswd: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Registration', RegistrationSchema);
const mongoose = require('mongoose');
const SchemaVariable = mongoose.Schema;

const ProductSchema = new SchemaVariable({
    protitle: {
        type: String,
        required: true
    },
    proimg: {
        type: String,
        required: true
    },
    proprice: {
        type: Number,
        required: true
    },
    prodesc: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Products', ProductSchema);
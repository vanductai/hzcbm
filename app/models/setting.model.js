const mongoose = require('mongoose');

const ModelSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    enable_draw: { type: Boolean, default: false },
    sequence_limit: { type: Number, default: 1 },
    delay_millisecond: { type: Number, default: 2000 },
});

const Model = mongoose.model('setting', ModelSchema);
module.exports = {
    Model,
}
const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');

const ModelSchema = new mongoose.Schema({
    address: { type: String, required: false, index: { unique: true, sparse: true } },
    places: [mongoose.Schema.Types.Mixed],
    count_place: { type: Number, index: true },
    last_draw_at : {type : Date},
    object_places : mongoose.Schema.Types.Mixed
});

ModelSchema.plugin(timestamps, {
    createdAt: 'created_at',
    updatedAt: 'modified_at'
});

ModelSchema.index({ created_at: 1, created_at: -1 });
ModelSchema.index({ modified_at: 1, modified_at: -1 });

const Model = mongoose.model('draw-address', ModelSchema);
module.exports = {
    Model,
}
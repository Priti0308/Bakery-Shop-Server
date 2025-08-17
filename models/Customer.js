const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: String,
  address: String,
  contact: String,
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  }
});

module.exports = mongoose.model('Customer', customerSchema);

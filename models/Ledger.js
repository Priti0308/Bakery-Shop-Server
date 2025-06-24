
const ledgerSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  // products: [String],
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],

  total: {
    type: Number,
    required: true
  },
  paid: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Ledger', ledgerSchema);


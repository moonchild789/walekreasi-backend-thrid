const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema(
  {
    userId: String,
    receiverName: {
      type: String,
      required: true,
      maxlength: 50,
    }, 
    address: String,
    cityOrRegency: String,
    pincode: String,
    phone: String,
    notes: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Address", AddressSchema);

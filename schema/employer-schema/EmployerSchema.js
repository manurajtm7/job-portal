const mongoose = require("mongoose");
const { Schema } = mongoose;

const EmployeSchema = new Schema(
  {
    // userDetail : { type : mongoose.Schema.ObjectId , ref : "" },
    companyName: {
      type: String,
      required: true, // This makes the field required
    },
    designation: {
      type: String,
      required: true, // This makes the field required
    },
    location: {
      type: String,
      required: true, // This makes the field required
    },
  },
  {
    timestamps: true, // This adds createdAt and updatedAt timestamps
  }
);

const EmployerModel = mongoose.model("Empolyer-Schema", EmployeSchema);

module.exports = EmployerModel;

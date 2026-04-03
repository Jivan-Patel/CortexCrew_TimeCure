import mongoose from "mongoose";
import {sendEmail} from "../servieces/email.service.js";

const accountSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  verified:{
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const accountModel = mongoose.model("Account", accountSchema);

export default accountModel;

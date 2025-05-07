'use strict';

const bcrypt = require('bcrypt');

const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'User';
const COLLECTION_NAME = 'users';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
    },
    roles: {
      type: Array,
      default: [],
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    verificationTokenExpires: Date,
    avatar_url: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);

userSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    delete ret.password;
  },
});

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  next();
});

userSchema.pre('findOneAndUpdate', async function (next) {
  const user = { ...this.getUpdate() };
  if (user.password) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  this.setUpdate(user);
  next();
});

userSchema.pre('findByIdAndUpdate', async function (next) {
  const user = { ...this.getUpdate() };
  if (user.password) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  this.setUpdate(user);
  next();
});

module.exports = model(DOCUMENT_NAME, userSchema);

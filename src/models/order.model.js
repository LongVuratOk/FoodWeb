'use strict';

const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'Order';
const COLLECTION_NAME = 'orders';

const orderSchema = new Schema(
  {
    customer: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    total_money: {
      type: String,
      required: true,
    },
    payment_method: {
      type: String,
      enum: ['online', 'on delivery'],
      default: 'on delivery',
    },
    is_payment: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['pending', 'confirm', 'ship', 'receive'],
      default: 'pending',
    },
    cart_id: {
      type: Schema.Types.ObjectId,
      ref: 'Cart',
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);

module.exports = model(DOCUMENT_NAME, orderSchema);

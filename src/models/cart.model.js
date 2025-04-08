'use strict';

const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'Cart';
const COLLECTION_NAME = 'carts';

const cartSchema = new Schema(
  {
    cart_state: {
      type: String,
      required: true,
      enum: ['active', 'complete', 'failed'],
      default: 'active',
    },
    cart_products: {
      type: [
        {
          productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
          },
          quantity: {
            type: Number,
            default: 1,
          },
        },
      ],
      required: true,
      default: [],
    },
    cart_count_product: {
      type: Number,
      default: 0,
    },
    cart_userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);

module.exports = model(DOCUMENT_NAME, cartSchema);

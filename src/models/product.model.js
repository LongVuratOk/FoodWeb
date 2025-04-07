'use strict';

const { model, Schema } = require('mongoose');
const slugify = require('slugify');

const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'products';

const productSchema = new Schema(
  {
    product_name: {
      type: String,
      required: true,
    },
    product_slug: String,
    product_thumb: {
      type: String,
      required: true,
    },
    product_description: String,
    product_price: {
      type: Number,
      required: true,
    },
    product_quatity: {
      type: Number,
      required: true,
    },
    product_category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    product_createBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    product_updateBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    product_ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10,
    },
    isDraff: {
      type: Boolean,
      default: true,
      index: true,
      select: false,
    },
    isPublished: {
      type: Boolean,
      default: false,
      index: true,
      select: false,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);
// create index for search
productSchema.index({ product_name: 'text', product_description: 'text' });

productSchema.pre('save', function (next) {
  this.product_slug = slugify(this.product_name, { lower: true });
  next();
});

module.exports = model(DOCUMENT_NAME, productSchema);

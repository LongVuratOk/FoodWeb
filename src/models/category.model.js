'use strict';

const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'Category';
const COLLECTION_NAME = 'categories';

const categorySchema = new Schema(
  {
    category_name: {
      type: String,
      required: true,
      unique: true,
    },
    category_img: {
      type: String,
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
categorySchema.index({ category_name: 'text' });

module.exports = model(DOCUMENT_NAME, categorySchema);

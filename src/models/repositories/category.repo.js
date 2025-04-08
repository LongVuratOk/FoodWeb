'use strict';

const {
  convertToObjectIdMongodb,
  getSelectData,
  getUnSelectData,
} = require('../../utils');
const CategoryModel = require('../category.model');
const { deleteManyProducts } = require('./product.repo');

const publishCategory = async (id) => {
  const foundCategory = await CategoryModel.findById(
    convertToObjectIdMongodb(id),
  );
  if (!foundCategory) {
    return null;
  }

  foundCategory.isDraff = false;
  foundCategory.isPublished = true;
  const { modifiedCount } = await foundCategory.updateOne(foundCategory);
  return modifiedCount;
};

const unPublishCategory = async (id) => {
  const foundCategory = await findByCategoryId(convertToObjectIdMongodb(id));
  if (!foundCategory) {
    return null;
  }

  foundCategory.isDraff = true;
  foundCategory.isPublished = false;
  const { modifiedCount } = await foundCategory.updateOne(foundCategory);
  return modifiedCount;
};

const createCategory = async (body) => {
  return await CategoryModel.create(body);
};

const updateCategory = async ({ id, bodyUpdate, isNew = true }) => {
  return await CategoryModel.findByIdAndUpdate(id, bodyUpdate, { new: isNew });
};

const deleteCategory = async (id) => {
  const deleteProducts = await deleteManyProducts({
    product_category: convertToObjectIdMongodb(id),
  });
  const deleteCat = await CategoryModel.findByIdAndDelete(id);
  return { deleteProducts, deleteCat };
};

const findByCategoryId = async (id) => {
  return await CategoryModel.findById(convertToObjectIdMongodb(id));
};

const findByCategoryName = async (name) => {
  return await CategoryModel.findOne({ category_name: name }).lean();
};

const findOneForCategory = async (filter) => {
  return await CategoryModel.findOne(filter).lean();
};

const searchCategory = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch);
  const result = await CategoryModel.find(
    {
      $text: { $search: regexSearch },
    },
    { score: { $meta: 'textScore' } },
  )
    .sort({ score: { $meta: 'textScore' } })
    .select(getUnSelectData(['_id', '__v']))
    .lean();
  return result;
};

// Query
const queryCategory = async ({ limit, sort, page, filter }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
  return await CategoryModel.find(filter)
    .skip(skip)
    .limit(limit)
    .sort(sortBy)
    .lean();
};

// End query

module.exports = {
  findByCategoryName,
  createCategory,
  findByCategoryId,
  findOneForCategory,
  publishCategory,
  unPublishCategory,
  queryCategory,
  searchCategory,
  updateCategory,
  deleteCategory,
};

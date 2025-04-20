'use strict';

const { getSelectData, getUnSelectData } = require('../../utils');
const DiscountModel = require('../discount.model');

const findAllDiscountCodeSeletect = async ({
  limit,
  page,
  sort,
  filter,
  select,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
  return await DiscountModel.find(filter)
    .limit(limit)
    .skip(skip)
    .sort(sortBy)
    .select(getSelectData(select))
    .lean();
};

const findAllDiscountCodeUnSeletect = async ({
  limit,
  page,
  sort,
  filter,
  unSelect,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
  return await DiscountModel.find(filter)
    .limit(limit)
    .skip(skip)
    .sort(sortBy)
    .select(getUnSelectData(unSelect))
    .lean();
};

const createDiscount = async (body) => {
  return await DiscountModel.create(body);
};

const findDiscountByCode = async (filter) => {
  return await DiscountModel.findOne(filter).lean();
};

const findByDiscountId = async (discoutId) => {
  return await DiscountModel.findById(discoutId);
};

const deleteDiscountCodeId = async (discountId) => {
  return await DiscountModel.findByIdAndDelete(discountId).lean();
};

const findOneAndUpdateDiscount = async (query, bodyUpdate, options) => {
  return await DiscountModel.findOneAndUpdate(query, bodyUpdate, options);
};

module.exports = {
  findDiscountByCode,
  findByDiscountId,
  createDiscount,
  findAllDiscountCodeSeletect,
  findAllDiscountCodeUnSeletect,
  deleteDiscountCodeId,
  findOneAndUpdateDiscount,
};

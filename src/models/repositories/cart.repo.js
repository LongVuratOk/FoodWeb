'use strict';

const CartModel = require('../cart.model');
const { convertToObjectIdMongodb } = require('../../utils/index');

const createUserCart = async (query, updateOrInsert, options) => {
  return await CartModel.findOneAndUpdate(query, updateOrInsert, options);
};

const findByUserIdCart = async (userId) => {
  return await CartModel.findOne({
    cart_userId: convertToObjectIdMongodb(userId),
    cart_state: 'active',
  })
    .populate(
      'cart_products.productId',
      'product_name product_thumb product_price',
    )
    .lean();
};

const findByCartId = async (cartId) => {
  return await CartModel.findById(cartId);
};

const deleteItemCart = async (query, updateSet) => {
  const { modifiedCount } = await CartModel.updateOne(query, updateSet);
  return modifiedCount;
};

module.exports = {
  createUserCart,
  findByUserIdCart,
  deleteItemCart,
  findByCartId,
};

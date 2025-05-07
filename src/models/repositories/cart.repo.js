'use strict';

const CartModel = require('../cart.model');
const { convertToObjectIdMongodb } = require('../../utils/index');
const BaseRepository = require('./base.repo');

class CartRepository extends BaseRepository {
  constructor() {
    super(CartModel);
  }

  findByUserIdCart(userId) {
    return this.getModel()
      .findOne({
        cart_userId: convertToObjectIdMongodb(userId),
        cart_state: 'active',
      })
      .populate(
        'cart_products.productId',
        'product_name product_thumb product_price',
      )
      .lean();
  }

  async deleteItemCart(query, updateSet) {
    const { modifiedCount } = await this.getModel().updateOne(query, updateSet);
    return modifiedCount;
  }
}

module.exports = CartRepository;

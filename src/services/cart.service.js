'use strict';

const { NotFoundError, BadRequestError } = require('../core/error.response');
const CartRepository = require('../models/repositories/cart.repo');
const {
  createUserCart,
  findByUserIdCart,
  deleteItemCart,
} = require('../models/repositories/cart.repo');
const ProductRepository = require('../models/repositories/product.repo');
const { findByProductId } = require('../models/repositories/product.repo');
const { convertToObjectIdMongodb } = require('../utils');

class CartService {
  constructor() {
    this.cartRepository = new CartRepository();
    this.productRepository = new ProductRepository();
  }

  async createOrInsertProductCart({ userId, product }) {
    const { productId, quantity } = product;
    const query = {
        cart_userId: convertToObjectIdMongodb(userId),
        cart_state: 'active',
      },
      updateOrInsert = {
        $push: {
          cart_products: { productId, quantity },
        },
        $inc: {
          cart_count_product: 1,
        },
      },
      options = {
        upsert: true,
        new: true,
      };

    return await this.cartRepository.updateOne(query, updateOrInsert, options);
  }

  async updateUserCartQuantity({ userId, product }) {
    const { productId, quantity, old_quantity } = product;
    const newQuatity = old_quantity ? quantity - old_quantity : quantity;
    const query = {
        cart_userId: convertToObjectIdMongodb(userId),
        'cart_products.productId': productId,
        cart_state: 'active',
      },
      updateSet = {
        $inc: {
          'cart_products.$.quantity': newQuatity,
        },
      },
      options = {
        upsert: true,
        new: true,
      };
    return await this.cartRepository.updateOne(query, updateSet, options);
  }

  async addToCart({ userId, product }) {
    const { productId, quantity, old_quantity } = product;

    const productExist = await this.productRepository.findById(productId);
    if (!productExist) {
      throw new NotFoundError('Sản phẩm không tồn tại');
    }

    if (productExist.product_quatity < quantity) {
      throw new BadRequestError('Số lượng không đủ');
    }

    const userCartExist = await this.cartRepository.findByUserIdCart(userId);
    if (!userCartExist) {
      return await this.createOrInsertProductCart({
        userId,
        product: {
          productId,
          quantity,
        },
      });
    }
    let isProductInCart = false;
    for (let index = 0; index < userCartExist.cart_products.length; index++) {
      if (
        userCartExist.cart_products[index].productId._id.toString() ===
        productId
      ) {
        isProductInCart = true;
        break;
      }
    }

    if (!isProductInCart) {
      return await this.createOrInsertProductCart({
        userId,
        product: {
          productId,
          quantity,
        },
      });
    }

    return await this.updateUserCartQuantity({
      userId,
      product: {
        productId,
        quantity,
        old_quantity,
      },
    });
  }

  async deleteItemCart({ userId, productId }) {
    const query = {
        cart_userId: convertToObjectIdMongodb(userId),
        cart_state: 'active',
      },
      updateSet = {
        $pull: {
          cart_products: {
            productId: convertToObjectIdMongodb(productId),
          },
        },
        $inc: {
          cart_count_product: -1,
        },
      };
    const result = await this.cartRepository.deleteItemCart(query, updateSet);
    if (!result) {
      throw new NotFoundError('Giỏ hàng không tồn tại');
    }
    return result;
  }

  async getListUserCart(userId) {
    return await this.cartRepository.findByUserIdCart(userId);
  }
}

module.exports = CartService;

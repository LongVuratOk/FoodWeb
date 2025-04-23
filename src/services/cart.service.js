'use strict';

const { NotFoundError, BadRequestError } = require('../core/error.response');
const {
  createUserCart,
  findByUserIdCart,
  deleteItemCart,
} = require('../models/repositories/cart.repo');
const { findByProductId } = require('../models/repositories/product.repo');
const { convertToObjectIdMongodb } = require('../utils');

class CartService {
  static createOrInsertProductCart = async ({ userId, product }) => {
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

    return await createUserCart(query, updateOrInsert, options);
  };

  static updateUserCartQuantity = async ({ userId, product }) => {
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
    return await createUserCart(query, updateSet, options);
  };

  static addToCart = async ({ userId, product }) => {
    const { productId, quantity, old_quantity } = product;

    const foundProduct = await findByProductId(productId);
    if (!foundProduct) {
      throw new NotFoundError('Sản phẩm không tồn tại');
    }

    if (foundProduct.product_quatity < quantity) {
      throw new BadRequestError('Số lượng không đủ');
    }

    const foundUserCart = await findByUserIdCart(userId);
    if (!foundUserCart) {
      return await CartService.createOrInsertProductCart({
        userId,
        product: {
          productId,
          quantity,
        },
      });
    }
    let isProductInCart = false;
    for (let index = 0; index < foundUserCart.cart_products.length; index++) {
      if (
        foundUserCart.cart_products[index].productId._id.toString() ===
        productId
      ) {
        isProductInCart = true;
        break;
      }
    }

    if (!isProductInCart) {
      return await CartService.createOrInsertProductCart({
        userId,
        product: {
          productId,
          quantity,
        },
      });
    }

    return await CartService.updateUserCartQuantity({
      userId,
      product: {
        productId,
        quantity,
        old_quantity,
      },
    });
  };

  static deleteItemCart = async ({ userId, productId }) => {
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
    const result = await deleteItemCart(query, updateSet);
    if (!result) {
      throw new NotFoundError('Giỏ hàng không tồn tại');
    }
    return result;
  };

  static getListUserCart = async (userId) => {
    return await findByUserIdCart(userId);
  };
}

module.exports = CartService;

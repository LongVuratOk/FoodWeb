'use strict';

const { OK } = require('../../core/success.response');
const CartService = require('../../services/cart.service');

class CartController {
  addToCart = async (req, res, next) => {
    new OK({
      message: 'Add product into cart successfully',
      metadata: await CartService.addToCart({
        userId: req.user.userId,
        product: req.body,
      }),
    }).send(res);
  };
  updateCartQuatity = async (req, res, next) => {
    new OK({
      message: 'Update quatity successfully',
      metadata: await CartService.updateUserCartQuantity({
        userId: req.user.userId,
        product: req.body,
      }),
    }).send(res);
  };

  deleteItemCart = async (req, res, next) => {
    new OK({
      message: 'Delete product from cart successfully',
      metadata: await CartService.deleteItemCart({
        userId: req.user.userId,
        productId: req.body.productId,
      }),
    }).send(res);
  };

  getListUserCart = async (req, res, next) => {
    new OK({
      message: 'get cart user successfully',
      metadata: await CartService.getListUserCart(req.user.userId),
    }).send(res);
  };
}

module.exports = new CartController();

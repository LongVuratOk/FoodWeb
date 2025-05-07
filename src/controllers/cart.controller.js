'use strict';

const { OK } = require('../core/success.response');
const CartService = require('../services/cart.service');

class CartController {
  constructor() {
    this.cartService = new CartService();
  }
  addToCart = async (req, res, next) => {
    new OK({
      message: 'Thêm sản phẩm vào giỏ hàng thành công',
      metadata: await this.cartService.addToCart({
        userId: req.user.userId,
        product: req.body,
      }),
    }).send(res);
  };
  updateCartQuatity = async (req, res, next) => {
    new OK({
      message: 'Cập nhật số lượng thành công',
      metadata: await this.cartService.updateUserCartQuantity({
        userId: req.user.userId,
        product: req.body,
      }),
    }).send(res);
  };

  deleteItemCart = async (req, res, next) => {
    new OK({
      message: 'Xóa sản phẩm khỏi giỏ hàng thành công',
      metadata: await this.cartService.deleteItemCart({
        userId: req.user.userId,
        productId: req.body.productId,
      }),
    }).send(res);
  };

  getListUserCart = async (req, res, next) => {
    new OK({
      message: 'Lấy danh sách sản phẩm giỏ hàng thành công',
      metadata: await this.cartService.getListUserCart(req.user.userId),
    }).send(res);
  };
}

module.exports = new CartController();

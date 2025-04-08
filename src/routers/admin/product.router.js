'use strict';

const express = require('express');
const { authentication } = require('../../auth/authentication');
const { asyncHandle } = require('../../middlewares/asyncHandle.middleware');
const ProductController = require('../../controllers/admin/product.controller');
const router = express.Router();

router.use(authentication);

router.get('/all', asyncHandle(ProductController.getAllProducts));
router.post('/create', asyncHandle(ProductController.createProduct));

router.get('/draff/all', asyncHandle(ProductController.getAllProductsDraff));
router.get(
  '/published/all',
  asyncHandle(ProductController.getAllProductsPublished),
);

router.get(
  '/search/:keySearch',
  asyncHandle(ProductController.getListSearchProduct),
);

router.post('/published/:_id', asyncHandle(ProductController.publishedProduct));
router.post(
  '/unPublished/:_id',
  asyncHandle(ProductController.unPublishedProduct),
);

router.get('/:_id', asyncHandle(ProductController.getProduct));
router.patch('/:_id', asyncHandle(ProductController.updateProduct));
router.delete('/:_id', asyncHandle(ProductController.deleteProduct));

module.exports = router;

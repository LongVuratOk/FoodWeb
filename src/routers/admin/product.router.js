'use strict';

const express = require('express');
const { authentication } = require('../../auth/authentication');
const { asyncHandle } = require('../../middlewares/asyncHandle.middleware');
const ProductController = require('../../controllers/product.controller');
const router = express.Router();

router.use(authentication);

router.get('/', asyncHandle(ProductController.getAllProducts));
router.post('/create', asyncHandle(ProductController.createProduct));

router.get('/draff/', asyncHandle(ProductController.getAllProductsDraff));
router.get('/publish/', asyncHandle(ProductController.getAllProductsPublished));

router.get(
  '/search/:keySearch',
  asyncHandle(ProductController.getListSearchProduct),
);

router.post('/publish/:_id', asyncHandle(ProductController.publishedProduct));
router.post(
  '/unPublish/:_id',
  asyncHandle(ProductController.unPublishedProduct),
);

router.get('/:_id', asyncHandle(ProductController.getProduct));
router.patch('/:_id', asyncHandle(ProductController.updateProduct));
router.delete('/:_id', asyncHandle(ProductController.deleteProduct));

module.exports = router;

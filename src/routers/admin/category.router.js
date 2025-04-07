'use strict';

const express = require('express');
const { asyncHandle } = require('../../middlewares/asyncHandle.middleware');
const { authentication } = require('../../auth/authentication');
const CategoryController = require('../../controllers/admin/category.controller');
const router = express.Router();

// authentication
//router.use(authentication);

router.get('/all', asyncHandle(CategoryController.getAllCategories));
router.get(
  '/publish/all',
  asyncHandle(CategoryController.getAllCategoriesPublish),
);
router.get('/draff/all', asyncHandle(CategoryController.getAllCategoriesDraff));
router.get(
  '/search/:keySearch',
  asyncHandle(CategoryController.getListSearchCategory),
);

router.post('/publish/:_id', asyncHandle(CategoryController.pushlishCategory));
router.post(
  '/unPublish/:_id',
  asyncHandle(CategoryController.unPushlishCategory),
);
router.post('/create', asyncHandle(CategoryController.createCategory));
router.patch('/:_id', asyncHandle(CategoryController.updateCategory));
router.delete('/:_id', asyncHandle(CategoryController.deleteCategory));
router.post('/shop/refreshToken', asyncHandle());

module.exports = router;

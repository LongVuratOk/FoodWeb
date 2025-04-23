'use strict';

const { BadRequestError } = require('../../core/error.response');
const { convertToObjectIdMongodb, getSelectData } = require('../../utils');
const categoryModel = require('../category.model');
const ProductModel = require('../product.model');

const createProduct = async (body) => {
  return await ProductModel.create(body);
};

const updateProduct = async ({ productId, bodyUpdate, isNew = true }) => {
  return await ProductModel.findByIdAndUpdate(productId, bodyUpdate, {
    new: isNew,
  });
};

const deleteProduct = async (productId) => {
  return await ProductModel.findByIdAndDelete(productId);
};

const deleteManyProducts = async (filter) => {
  const { deletedCount } = await ProductModel.deleteMany(filter);
  return deletedCount;
};

const findByProductId = async (id) => {
  return await ProductModel.findById(id)
    .populate('product_category', 'category_name')
    .populate('product_createBy', 'name')
    .lean();
};

const publishedProduct = async ({ product_id }) => {
  const foundProduct = await findByProductId(
    convertToObjectIdMongodb(product_id),
  );

  console.log(typeof findOneForCategory);

  const pubCategory = await categoryModel.findOne({
    _id: convertToObjectIdMongodb(foundProduct.product_category),
    isPublished: true,
  });

  if (!pubCategory) {
    throw new BadRequestError('Category is unPublish');
  }

  if (!foundProduct) {
    return null;
  }

  foundProduct.isDraff = false;
  foundProduct.isPublished = true;
  const { modifiedCount } = await foundProduct.updateOne(foundProduct);

  return modifiedCount;
};

const unPublishedProduct = async ({ product_id }) => {
  const foundProduct = await findByProductId(
    convertToObjectIdMongodb(product_id),
  );

  if (!foundProduct) {
    return null;
  }

  foundProduct.isDraff = true;
  foundProduct.isPublished = false;
  const { modifiedCount } = await foundProduct.updateOne(foundProduct);

  return modifiedCount;
};

const searchProduct = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch);
  const result = await ProductModel.find(
    {
      $text: { $search: regexSearch },
    },
    { score: { $meta: 'textScore' } },
  )
    .sort({ score: { $meta: 'textScore' } })
    .lean();
  return result;
};

const queryProduct = async ({ limit, sort, page, filter }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
  return await ProductModel.find(filter)
    .populate('product_category', 'category_name')
    .populate('product_createBy', 'name')
    .skip(skip)
    .limit(limit)
    .sort(sortBy)
    .lean();
};

const findAllProductForDiscount = async ({
  limit,
  sort,
  page,
  filter,
  select,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
  return await ProductModel.find(filter)
    .skip(skip)
    .limit(limit)
    .sort(sortBy)
    .select(getSelectData(select))
    .lean();
};

const checkProductByServer = async (products) => {
  return await Promise.all(
    products.map(async (product) => {
      const productFound = await ProductModel.findById(product.productId);
      if (productFound) {
        return {
          price: productFound.product_price,
          quantity: product.quantity,
          productId: product.productId,
        };
      }
    }),
  );
};

module.exports = {
  findByProductId,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteManyProducts,
  queryProduct,
  searchProduct,
  publishedProduct,
  unPublishedProduct,
  findAllProductForDiscount,
  checkProductByServer,
};

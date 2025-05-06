'use strict';

const { convertToObjectIdMongodb, getUnSelectData } = require('../../utils');
const ProductModel = require('../product.model');
const BaseRepository = require('./base.repo');

class ProductRepository extends BaseRepository {
  constructor() {
    super(ProductModel);
  }

  findById(id) {
    return this.getModel()
      .findById(convertToObjectIdMongodb(id))
      .populate('product_category', 'category_name')
      .populate('product_createBy', 'name')
      .lean();
  }

  async publishProduct(id) {
    const { modifiedCount } = await this.updateOne(
      { _id: convertToObjectIdMongodb(id) },
      { isPublished: true, isDraff: false },
    );
    console.log(modifiedCount);
    return modifiedCount;
  }

  async unPublishProduct(id) {
    const { modifiedCount } = await this.updateOne(
      { _id: convertToObjectIdMongodb(id) },
      { isPublished: false, isDraff: true },
    );
    return modifiedCount;
  }

  searchProduct({ keySearch }) {
    return this.getModel()
      .find(
        {
          $text: { $search: keySearch },
        },
        { score: { $meta: 'textScore' } },
      )
      .sort({ score: { $meta: 'textScore' } })
      .select(getUnSelectData(['createdAt', 'updatedAt', '__v']))
      .lean();
  }

  async queryProduct({ keySearch, filter, limit, skip, sort }) {
    let query = this.getModel().find(filter);
    if (keySearch) {
      const regexSearch = new RegExp(keySearch);
      query = query
        .find(
          {
            $text: { $search: regexSearch },
          },
          { score: { $meta: 'textScore' } },
        )
        .sort({ score: { $meta: 'textScore' } });
    }
    return await query
      .populate('product_category', 'category_name')
      .populate('product_createBy', 'name')
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .select(getUnSelectData(['createdAt', 'updatedAt', '__v']))
      .lean();
  }

  async getProductForCart(products) {
    return await Promise.all(
      products.map(async (product) => {
        const productFound = await ProductModel.findById(product.productId._id);
        if (productFound) {
          return {
            price: productFound.product_price,
            quantity: product.quantity,
            productId: product.productId._id,
          };
        }
      }),
    );
  }
}

module.exports = ProductRepository;

'use strict';

const { convertToObjectIdMongodb, getUnSelectData } = require('../../utils');
const CategoryModel = require('../category.model');
const BaseRepository = require('./base.repo');

class CategoryRepository extends BaseRepository {
  constructor() {
    super(CategoryModel);
  }

  async publishCategory(id) {
    const { modifiedCount } = await this.getModel().updateOne(
      { _id: convertToObjectIdMongodb(id) },
      { isPublished: true, isDraff: false },
    );
    return modifiedCount;
  }

  async unPublishCategory(id) {
    const { modifiedCount } = await this.getModel().updateOne(
      { _id: convertToObjectIdMongodb(id) },
      { isPublished: false, isDraff: true },
    );
    return modifiedCount;
  }

  searchCategory({ keySearch }) {
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

  async queryCategory({ keySearch, filter, limit, skip, sort }) {
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
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .select(getUnSelectData(['createdAt', 'updatedAt', '__v']))
      .lean();
  }
}

module.exports = CategoryRepository;

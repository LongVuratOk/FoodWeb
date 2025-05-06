'use strict';

const DiscountModel = require('../discount.model');
const BaseRepository = require('./base.repo');

class DiscountRepository extends BaseRepository {
  constructor() {
    super(DiscountModel);
  }

  findAllDiscountCode({ limit, page, sort, filter, fieldSelect }) {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
    return this.getModel()
      .find(filter)
      .limit(limit)
      .skip(skip)
      .sort(sortBy)
      .select(fieldSelect)
      .lean();
  }
}

module.exports = DiscountRepository;

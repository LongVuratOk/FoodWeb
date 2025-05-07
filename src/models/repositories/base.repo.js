'use strict';

const PAGINATE_OPTIONS = require('../../constants/type.paginate');

class BaseRepository {
  constructor(model) {
    this.setModel(model);
  }

  getModel() {
    return this.model;
  }

  setModel(model) {
    this.model = model;
  }
  create(data) {
    return this.getModel().create(data);
  }

  findBy(filter = {}) {
    return this.getModel().find(filter);
  }

  findOne(filter) {
    return this.getModel().findOne(filter);
  }

  findById(id) {
    return this.getModel().findById(id);
  }
  updateOne(query, updateSet, options = {}) {
    return this.getModel().updateOne(query, updateSet, options);
  }

  updateMany(query, updateSet, options = {}) {
    return this.getModel().updateMany(query, { $set: updateSet }, options);
  }

  deleteOne(filter) {
    return this.getModel().deleteOne(filter);
  }

  deleteMany(filter) {
    return this.getModel().deleteMany(filter);
  }

  search(fields, keySearch) {
    const regex = new RegExp(keySearch, 'i');
    const fieldSearch = fields.map((item) => ({ [item]: { $regex: regex } }));
    return this.getModel()
      .find({
        $or: fieldSearch,
      })
      .lean();
  }

  countDoc(filter) {
    return this.getModel().countDocuments(filter);
  }

  async query(
    filter = {},
    limit = PAGINATE_OPTIONS.LIMIT,
    page = PAGINATE_OPTIONS.PAGE,
    fieldSelect = [],
  ) {
    limit = +limit || PAGINATE_OPTIONS.LIMIT;
    page = +page || PAGINATE_OPTIONS.PAGE;
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.getModel().find(filter).skip(skip).limit(limit).select(fieldSelect),
      this.getModel().countDocuments(filter),
    ]);
    return { data, total, limit, page, totalPage: Math.ceil(total / limit) };
  }
}

module.exports = BaseRepository;

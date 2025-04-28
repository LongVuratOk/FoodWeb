'use strict';

class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    return await this.model.create(data);
  }

  async findAll(filter = {}) {
    return await this.model.find(filter).lean();
  }

  async findOne(filter) {
    return await this.model.findOne(filter);
  }

  async updateOne(query, updateSet, options = {}) {
    return await this.model.updateOne(query, updateSet, options);
  }

  async updateMany(query, updateSet, options = {}) {
    return await this.model.updateMany(query, { $set: updateSet }, options);
  }

  async deleteOne(filter = {}) {
    return await this.model.deleteOne(filter);
  }

  async deleteMany(filter = {}) {
    return await this.model.deleteMany(filter);
  }

  async search(fields, keySearch) {
    const regex = new RegExp(keySearch, 'i');
    const fieldSearch = fields.map((item) => ({ [item]: { $regex: regex } }));
    return await this.model
      .find({
        $or: fieldSearch,
      })
      .lean();
  }

  async query(query, limit = 50, skip = 0) {
    return await this.model
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();
  }

  async countDoc(filter = {}) {
    return await this.model.countDocuments(filter);
  }
}

module.exports = BaseRepository;

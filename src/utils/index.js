'use strict';

const _ = require('lodash');
const { Types } = require('mongoose');

const convertToObjectIdMongodb = (id) => new Types.ObjectId(id);

const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};

module.exports = {
  getInfoData,
  convertToObjectIdMongodb,
};

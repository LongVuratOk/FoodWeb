'use strict';

const _ = require('lodash');
const { Types } = require('mongoose');

const convertToObjectIdMongodb = (id) => new Types.ObjectId(id);

const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};

const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((e1) => [e1, 1]));
};

const getUnSelectData = (select = []) => {
  return Object.fromEntries(select.map((e1) => [e1, 0]));
};

module.exports = {
  getInfoData,
  convertToObjectIdMongodb,
  getSelectData,
  getUnSelectData,
};

'use strict';

/**
 * Module dependencies.
 */
const mongoose = require('mongoose');
const mongoosastic = require('mongoosastic');
const autoIncrement = require('mongoose-auto-increment');
const Schema = mongoose.Schema;
const config = require('../config/config');
autoIncrement.initialize(mongoose);
/**
 * Create schema.
 */
var schema = new Schema({
  fund_id: {
    type: Schema.Types.Number,
    es_indexed: true
  },
  fund_name: {
    type: String,
    default: '',
    trim: true,
    es_indexed: true
  },
  manager_id: {
    type: Schema.Types.Number,
    es_indexed: true
  },
  manager_name: {
    type: String,
    default: '',
    trim: true,
    es_indexed: true
  },
  source: {
    type: String,
    default: 'manual',
    es_indexed: true
  }
}, {
  id: false,
  toJSON: {
    virtuals: true
  },
  usePushEach: true,
  timestamps: { createdAt: 'created_at' },
  collection: 'fund_manual',
  strict: false,
});
schema.plugin(autoIncrement.plugin, {
  model: 'fund_manual',
  field: 'fund_id',
  unique: true,
  startAt: 1
});
schema.index({
  fund_id: 1,
  fund_name: 1
});
schema.plugin(mongoosastic, {
  hosts: [config.elasticsearch]
});
/**
 * Create model.
 */
let Fund = {};

/**
 * Get FileMapping by id
 * @param  {Object} condition
 * @returns {Promise<Object>}
 */
schema.statics.searchFund = function (condition) {
  return new Promise((resolve, reject) => {
    Fund.search(condition, function (err, result) {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    })
  });
};
/**
 * Create model.
 */
Fund = mongoose.model('fund_manual', schema);
/**
 * Export model.
 */

module.exports = Fund;

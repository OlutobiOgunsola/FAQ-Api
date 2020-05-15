'use strict';

const fs = require('fs');
const Path = require('path');

/**
 * A lightweight JSON based database engine with lightning speed
 * @kind class
 * @version v0.1
 * @public
 * @licence MIT
 * @name JSONDatabase
 * @copyright ©2020-FactMan
 * @author Mohammed Odunayo <factman60@gmail.com>
 */
class JSONDatabase {
  /**
   * constrictor
   * @param {string} modelName
   * @param {Object} modelSchema
   */
  constructor(modelName, modelSchema) {
    this._name = modelName;
    this._schema = modelSchema;
    this._data = {};
    this._info = {
      currentId: 0,
      totalRow: 0,
      schema: {
        id: 'number',
        createdAt: 'Date',
        updatedAt: 'Date',
      },
    };

    this._modelExist();
    this._initializeSchema();
  }

  /**
   * Write schema to file
   * @private
   * @return {Promise<boolean>}
   */
  _saveModel() {
    return new Promise(resolve => {
      const dirPath = Path.dirname(this._getModelPath(this._name));
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
      }

      const modelData = {
        data: this._data,
        info: this._info,
      };

      const buffer = Buffer.from(JSON.stringify(modelData));
      fs.writeFile(this._getModelPath(this._name), buffer.toString('base64'), 'utf8', e => {
        if (e) {
          console.error(e.message, e);
          return resolve(false);
        }
        return resolve(true);
      });
    });
  }

  /**
   * Read model from file
   * @private
   */
  _readModel() {
    try {
      const rawStream = fs.readFileSync(this._getModelPath(this._name), 'utf8');
      const buffer = Buffer.from(rawStream.toString(), 'base64');
      const rawData = JSON.parse(buffer.toString('utf8'));
      this._info = rawData.info;
      this._data = rawData.data;
    } catch (e) {
      console.error(e.message, e);
    }
  }

  /**
   * Initialize the model
   * @private
   */
  _initializeSchema() {
    if (!this._modelExist()) {
      this._info.schema = Object.assign({}, this._info.schema, this._schema);
      this._saveModel().then(() => {
        this._readModel();
      });
    } else {
      this._readModel();
    }
  }

  /**
   * Check is a model exists
   * @private
   * @return {boolean}
   */
  _modelExist() {
    try {
      return fs.existsSync(this._getModelPath(this._name));
    } catch (e) {
      console.error(e.message, e);
      return false;
    }
  }

  /**
   * Get Model absolute path
   * @param {string} fileName
   * @return {string}
   * @private
   */
  _getModelPath(fileName) {
    return Path.join(__dirname, 'db/', `${fileName}.db`);
  }

  /**
   * Return array of string representing selected fields
   * @param {string | string[]} fields
   * @private
   * @return {string[]}
   */
  _parseFields(fields) {
    if (typeof fields === 'string') {
      if (fields === '*') {
        return Object.keys(this._info.schema);
      } else {
        return fields.split(',').map(field => field.trim());
      }
    } else {
      return fields.map(field => field.trim());
    }
  }

  /**
   * Return array of records with valid fields
   * @param {Object | Object[]} records
   * @private
   * @return {Object[]}
   */
  _parseRecord(records) {
    if (records.hasOwnProperty('length')) {
      return records.map(value => {
        const record = {};
        Object.keys(this._schema).forEach(field => {
          record[field] = value[field] || null;
        });
        return record;
      });
    } else {
      const record = {};
      Object.keys(this._schema).forEach(field => {
        record[field] = records[field] || null;
      });
      return [record];
    }
  }

  /**
   * Check if an id exist in the table
   * @param {number} id
   * @private
   * @return {boolean}
   */
  _idExists(id) {
    return this._data.hasOwnProperty(id);
  }

  /**
   * Update a record using it's id
   * @param {number} id
   * @param {Object} record
   * @return {Promise<Object>}
   */
  updateById(id, record) {
    return new Promise((resolve, reject) => {
      try {
        if (!this._idExists(id)) {
          return reject(new Error(`No Record with id=${id} found`));
        }
        const fields = Object.keys(this._schema);
        const newData = {};
        const data = this._data[id];
        Object.keys(record).forEach(key => {
          if (fields.includes(key)) {
            newData[key] = record[key];
          }
        });
        this._data[id] = Object.assign({}, data, newData, { updatedAt: new Date().toJSON() });
        this._saveModel().then();
        return resolve(this._data[id]);
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * Delete a record using id
   * @param {number} id
   * @return {Promise<boolean>}
   */
  deleteById(id) {
    return new Promise((resolve, reject) => {
      try {
        if (!this._idExists(id)) {
          return reject(new Error(`No Record with id=${id} found`));
        }
        delete this._data[id];
        this._info.totalRow = Object.values(this._data).length;
        this._saveModel().then();
        return resolve(true);
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * Insert a new record
   * @param {Object | Object[]} record
   * @return {Promise<Object>}
   */
  insert(record) {
    return new Promise((resolve, reject) => {
      try {
        const data = [];
        this._parseRecord(record).forEach(value => {
          this._info.currentId++;
          const row = {};
          Object.assign(row, value, {
            id: this._info.currentId,
            createdAt: new Date().toJSON(),
            updatedAt: null,
          });
          data.push(row);
          this._data[this._info.currentId] = row;
        });

        this._info.totalRow = Object.values(this._data).length;
        this._saveModel().then();

        if (data.length === 1) {
          return resolve(data[0]);
        }
        return resolve(data);
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * Select records from the database with id
   * @param {number} id
   * @param {string | string[]} fields
   * @return {Object}
   */
  selectById(id, fields = '*') {
    return new Promise((resolve, reject) => {
      try {
        if (!this._idExists(id)) {
          return reject(new Error(`No Record with id=${id} found`));
        }
        const fieldList = this._parseFields(fields);
        const data = {};
        fieldList.forEach(field => {
          data[field] = this._data[id][field];
        });
        return data;
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * Search the database for a given keyword
   * @param {string | string[]} searchFields
   * @param {string} keyword
   * @param {string | string[]} fields
   * @param {number | null} limit
   * @param {number} start
   * @return {Promise<Object[]>}
   */
  find(searchFields, keyword, fields = '*', limit = null, start = 0) {
    return new Promise((resolve, reject) => {
      try {
        const fieldList = this._parseFields(fields);
        const criteriaFields = this._parseFields(searchFields);
        const records = Object.values(this._data)
          .filter(value => {
            let found = false;
            criteriaFields.forEach(field => {
              if (typeof value[field] === 'string') {
                if (value[field].toLowerCase().includes(keyword.toLowerCase())) {
                  found = true;
                }
              }
            });
            return found;
          })
          .map(value => {
            const data = {};
            fieldList.forEach(field => {
              data[field] = value[field];
            });
            return data;
          });

        if (limit) {
          return resolve(records.slice(start, start + limit));
        }
        return resolve(records);
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * Select records from the database
   * @param {string | string[]} fields
   * @param {{field: *} | null} whereAND
   * @param {{field: *} | null} whereOR
   * @param {number | null} limit
   * @param {number} start
   * @return {Promise<Object[]>}
   */
  select(fields = '*', whereAND = null, whereOR = null, limit = null, start = 0) {
    return new Promise((resolve, reject) => {
      try {
        const fieldList = this._parseFields(fields);
        let records;
        if (whereAND) {
          records = Object.values(this._data)
            .filter(value => {
              let found = true;
              Object.keys(whereAND).forEach(field => {
                if (value[field] != whereAND[field]) {
                  found = false;
                }
              });
              return found;
            })
            .map(value => {
              const data = {};
              fieldList.forEach(field => {
                data[field] = value[field];
              });
              return data;
            });
        } else if (whereOR) {
          records = Object.values(this._data)
            .filter(value => {
              let found = false;
              Object.keys(whereOR).forEach(field => {
                if (value[field] == whereOR[field]) {
                  found = true;
                }
              });
              return found;
            })
            .map(value => {
              const data = {};
              fieldList.forEach(field => {
                data[field] = value[field];
              });
              return data;
            });
        } else {
          records = Object.values(this._data).map(value => {
            const data = {};
            fieldList.forEach(field => {
              data[field] = value[field];
            });
            return data;
          });
        }

        if (limit) {
          return resolve(records.slice(start, start + limit));
        }
        return resolve(records);
      } catch (e) {
        reject(e);
      }
    });
  }
}

module.exports = JSONDatabase;

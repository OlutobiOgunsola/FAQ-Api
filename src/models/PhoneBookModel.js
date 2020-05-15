/'use strict';

const JSONDatabase = require('../../lib/JSONDatabase');

/**
 * PhoneBookModel
 * @kind class
 * @extends JSONDatabase
 */
class PhoneBookModel extends JSONDatabase {
  /**
   * constructor
   */
  constructor() {
    super('PhoneBook', {
      name: 'string',
      number: 'string',
      email: 'string',
      address: 'string',
    });
  }
}

module.exports = PhoneBookModel;

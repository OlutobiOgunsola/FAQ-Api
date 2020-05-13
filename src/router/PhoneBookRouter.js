'use strict';

const {Router} = require('express');
const PhoneBookController = require('../controllers/PhoneBookController');

/**
 * PhoneBookRouter Class
 * @kind class
 * @extends PhoneBookController
 * @return {Router}
 */
class PhoneBookRouter extends PhoneBookController {
  /**
   * constructor
   * @return {Router}
   */
  constructor() {
    super();

    return Router()
        .get('/contacts', this.getContacts)
        .post('/contacts', this.createContact)
        .get('/contacts/:id', this.getContactById)
        .put('/contacts/:id', this.editContact)
        .delete('/contacts/:id', this.deleteContact)
        .get('/search/:keyword', this.searchContacts);
  }
}

module.exports = PhoneBookRouter;

"use strict";

const {Router} = require('express');
const PhoneBookController = require('../controllers/PhoneBookController');

/**
 * @type PhoneBookRouter
 * @kind class
 * @extends PhoneBookController
 * @return {Router}
 */
class PhoneBookRouter extends PhoneBookController {
    constructor() {
        super();

        return Router()
            .get('/contacts', this.getContacts.bind(this))
            .post('/contacts', this.createContact.bind(this))
            .get('/contacts/:id', this.getContactById.bind(this))
            .put('/contacts/:id', this.editContact.bind(this))
            .delete('/contacts/:id', this.deleteContact.bind(this))
            .get('/search/:keyword', this.searchContacts.bind(this));
    }
}

module.exports = PhoneBookRouter;

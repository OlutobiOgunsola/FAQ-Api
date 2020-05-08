"use strict";

const PhoneBookModel = require('../models/PhoneBookModel');

/**
 * @type PhoneBookController
 * @kind class
 * @extends PhoneBookModel
 */
class PhoneBookController {
    constructor() {
        this.PhoneBookModel = new PhoneBookModel();
    }

    /**
     * Return all contacts
     * @param req
     * @param res
     * @param next
     */
    getContacts(req, res, next) {
        // This is equivalent to "SELECT * FROM table" in SQL
        this.PhoneBookModel.select()
            .then(contacts => {
                res.json({
                    success: true,
                    data: contacts,
                });
            })
            .catch(next);
    };

    /**
     * Return a contact using the contact :id
     * @param req
     * @param res
     * @param next
     */
    getContactById(req, res, next) {
        const id = Number.parseInt(req.params.id);
        // This is also equivalent to "SELECT * FROM table WHERE id=`id`" in SQL
        this.PhoneBookModel.selectById(id)
            .then(contact => {
                res.json({
                    success: true,
                    data: contact,
                });
            })
            .catch(next);
    };

    /**
     * Return all contacts that match the provided :keyword
     * @param req
     * @param res
     * @param next
     */
    searchContacts(req, res, next) {
        const {keyword} = req.params;
        // This is equivalent to "SELECT id,name,number FROM table WHERE name LIKE %keyword% OR number LIKE %keyword%" in SQL
        this.PhoneBookModel.find(['name', 'number'], keyword, ['id', 'name', 'number'])
            .then(found => {
                res.json({
                    success: true,
                    data: found,
                });
            })
            .catch(next);
    };

    /**
     * Create a contact
     * @param req
     * @param res
     * @param next
     */
    createContact(req, res, next) {
        const contact = req.body;
        // This is equivalent to "INSERT INTO table (field1, field2, ...) VALUES (value1, value2, ...)" in SQL
        this.PhoneBookModel.insert(contact)
            .then(newContact => {
                res.status(201).json({
                    success: true,
                    data: newContact,
                });
            })
            .catch(next);
    };

    /**
     * Edit a contact
     * @param req
     * @param res
     * @param next
     */
    editContact(req, res, next) {
        const data = req.body;
        const id = Number.parseInt(req.params.id);
        // This is equivalent to "UPDATE table SET field1=`value1`, field2=`value2`, ... WHERE id=`id`" in SQL
        this.PhoneBookModel.updateById(id, data)
            .then(contact => {
                res.json({
                    success: true,
                    data: contact,
                });
            })
            .catch(next);
    };

    /**
     * delete a contact using the contact :id
     * @param req
     * @param res
     * @param next
     */
    deleteContact(req, res, next) {
        const id = Number.parseInt(req.params.id);
        // This is equivalent to "DELETE FROM table WHERE id=`id`" in SQL
        this.PhoneBookModel.deleteById(id)
            .then(value => {
                res.json({
                    success: value,
                    data: null,
                });
            })
            .catch(next);
    };
}

module.exports = PhoneBookController;

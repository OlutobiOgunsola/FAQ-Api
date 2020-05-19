'use strict';

const AnswerController = require('../controllers/AnswerController');
const { Router } = require('express');

/** Answer Router
 *  @kind class
 *  @extends AnswerController
 *  @returns router
 */

module.exports = class AnswerRouter extends AnswerController {
  /** Initialize constructor */
  constructor() {
    super();

    return Router()
      .post('/questions/:id/answer', this.postAnswer.bind(this))
      .get('/questions/:id/answers/:answerid', this.getAnswerById.bind(this))
      .get('/questions/:id/answers')
      .put('/questions/:id/answers/:answerid/rate', this.addAnswerRating.bind(this))
      .delete('/questions/:id/answers/:answerid', this.deleteAnswer.bind(this))
      .put('/questions/:id/answers/:answerid/comments/add', this.addAnswerComments.bind(this));
  }
};

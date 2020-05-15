'use strict';
const { Router } = require('express');
const FAQController = require('../controllers/FAQController');

/** App Router Class
 *  @kind class
 *  @extends FAQController
 *  @return Router
 */
class FAQRouter extends FAQController {
  constructor() {
    super();

    return Router()
      .post('/addQuestion', this.addQuestion.bind(this))
      .put('/questions/:id/addanswer', this.postAnswer.bind(this))
      .put('/questions/:id/addrating', this.addQuestionRating.bind(this))
      .get('/questions/:id', this.getQuestionsById.bind(this))
      .get('/questions', this.getAllQuestions.bind(this))
      .get('/questions/:id/answers/:answerid', this.getAnswerById.bind(this));
  }
}

module.exports = FAQRouter;

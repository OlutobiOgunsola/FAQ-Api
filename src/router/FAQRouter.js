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
      .put('/questions/:id/answer', this.postAnswer.bind(this))
      .put('/questions/:id/rate', this.addQuestionRating.bind(this))
      .put('/questions/:id/answers/:answerid/rate', this.addAnswerRating.bind(this))
      .put('/questions/:id/answers/:answerid/comments/add', this.addAnswerComments.bind(this))
      .put('/questions/:id/answers/:answerid/comments/:commentid/add', this.addCommentComments.bind(this))
      .get('/questions/:id', this.getQuestionsById.bind(this))
      .get('/questions', this.getAllQuestions.bind(this))
      .get('/questions/:id/answers/:answerid', this.getAnswerById.bind(this))
      .delete('/questions/:id/answers/:answerid', this.deleteAnswer.bind(this))
      .delete('/questions/:id/answers/:answerid/comments/:commentid', this.deleteComments.bind(this));
  }
}

module.exports = FAQRouter;

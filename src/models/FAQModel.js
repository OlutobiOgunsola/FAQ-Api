const JSONDB = require('../../lib/JSONDatabase/index');

const QuestionSchema = {
  id: 'string',
  question_id: 'string',
  question: 'string',
  answers: 'array',
  categories: 'array',
  ratings: 'array',
};

/** Class FAQModel
 *  @kind class
 *   @type Model
 *   @extends JSONDatabase
 */

module.exports = class FAQModel extends JSONDB {
  constructor() {
    super('FAQModel', QuestionSchema);
  }
};

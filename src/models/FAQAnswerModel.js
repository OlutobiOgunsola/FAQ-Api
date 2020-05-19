const JSONDB = require('../../lib/JSONDatabase/index');

const AnswerSchema = {
  id: 'string',
  answer_id: 'string',
  answer: 'string',
  ratings: 'array',
  comments: 'array',
};

/** Class AnswerModel
 *  @kind class
 *   @type Model
 *   @extends JSONDatabase
 */

module.exports = class AnswerModel extends JSONDB {
  /** Call constructor */
  constructor() {
    super('AnswerModel', AnswerSchema);
  }
};

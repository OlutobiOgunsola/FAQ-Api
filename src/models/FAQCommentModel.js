const JSONDB = require('../../lib/JSONDatabase/index');

const CommentSchema = {
  id: 'string',
  comment: 'string',
  ratings: 'array',
  parent_id: 'string',
  comment_id: 'string',
  comments: 'array',
};

/** Class CommentsModel
 *  @kind class
 *   @type Model
 *   @extends JSONDatabase
 */

module.exports = class CommentsModel extends JSONDB {
  /** Call constructor */
  constructor() {
    super('CommentsModel', CommentSchema);
  }
};

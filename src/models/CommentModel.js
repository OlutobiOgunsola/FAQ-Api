const { uuidv4 } = require('uuid');

/** Define class comment
 *  @kind class
 *  @returns {Object} comment
 */

module.exports = class Comments extends Answer {
  constructor(answer, parentQuestionID) {
    super(answer, parentQuestionID);
  }

  mapToModel() {
    return {
      comment: this._answer,
      ratings: this._ratings,
      parent_id: this._parentQuestionID,
      id: this._id,
      comments: this._comments,
    };
  }
};

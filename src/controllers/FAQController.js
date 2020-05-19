'use strict';

const FAQModel = require('../models/FAQModel');
// const Answer = require('../models/AnswerModel');
// const Comment = require('../models/CommentModel');
const Question = require('../models/QuestionModel');

// Get all questions
// Get questions by category
// Get questions by id
// Post an answer
// Get an answer by id
// Add rating to question
// Add rating to answer
// Add comments to answer
// Add comments to comments
// Delete question
// Delete answer
// Delete comment

/** Initialize FAQ Controller
 *  @kind class
 *  @extends FAQModel
 */

class FAQController extends FAQModel {
  constructor() {
    super();

    /** Get all questions
     *  @param {Object} req - the request object
     *  @param {Object} res - the response object
     *  @param {Object} next - the next middleware in stack
     *  @return {Object} Questions - all questions in DB
     */
    this.getAllQuestions = (req, res, next) => {
      this.select()
        .then(questions => {
          res.status(200).json({
            success: true,
            data: questions,
          });
        })
        .catch(next);
    };

    /** Get Questions by Category
     *  @param {Object} req - the request object
     *  @param {Object} res - the response object
     *  @param {Object} next- the next middleware in stack
     *  @returns {Object} Questions - the questions by category
     */
    this.getQuestionsByCategory = (req, res, next) => {
      const { category } = req.params;

      this.find(['category'], category, ['question', 'answers', 'categories']).then(questions => {
        res
          .status(200)
          .json({
            success: true,
            data: questions,
          })
          .catch(next);
      });
    };

    /** Get Questions by ID
     *  @param {Object} req - the request object
     *  @param {Object} res - the response object
     *  @param {Object} next- the next middleware in stack
     *  @returns {Object} Questions - the questions by category
     */
    this.getQuestionsById = (req, res, next) => {
      const { id } = req.params;

      this.find(['question_id'], id)
        .then(question => {
          res.status(200).json({
            success: true,
            data: question,
          });
        })
        .catch(next);
    };

    /** Add a question
     *  @param {Object} req - the request object
     *  @param {Object} res - the response object
     *  @param {Object} next- the next middleware in stack
     *  @returns {Object} Questions - the question with answer included in array
     */
    this.addQuestion = (req, res, next) => {
      const question = new Question(req.body.question, req.body.categories);
      console.log('New Question received');

      this.insert(question.mapToModel())
        .then(inserted => {
          res.status(201).json({
            success: true,
            data: inserted,
          });
        })
        .catch(next);
    };

    /** Add Question rating
     *  @param {Object} req - the request object
     *  @param {Object} res - the response object
     *  @param {Object} next- the next middleware in stack
     *  @returns {Object} Questions - the questions by category
     */
    this.addQuestionRating = (req, res, next) => {
      const parentID = req.params.id;
      const { rating } = req.body;

      //get parent question Object
      this.find(['question_id'], parentID)
        .then(question => {
          let questionID;
          let foundQuestion = question[0];
          questionID = foundQuestion.id;
          foundQuestion.ratings.push(Number.parseInt(rating));

          this.updateById(questionID, foundQuestion).then(response => {
            res.status(200).json({
              success: true,
              data: response,
            });
          });
        })
        .catch(next);
    };

    /** Add comments to comment
     *  @param {Object} req - the request object
     *  @param {Object} res - the response object
     *  @param {Object} next- the next middleware in stack
     *  @returns {Object} Questions - the questions by category
     */
    this.addCommentComments = (req, res, next) => {
      const { commentid, answerid, id } = req.params;
      const { comment } = req.body;
      const commentString = new Comment(comment, answerid);
      this.find(['question_id'], id).then(question => {
        const foundQuestion = question[0];
        const foundAnswer = foundQuestion.answers.filter(answer => {
          return answer.id === answerid;
        });
        const foundComment = foundAnswer[0].comments.filter(comment => {
          return comment.id === commentid;
        });

        const questionID = foundQuestion.id;

        foundComment[0].comments.push(commentString.mapToModel());
        // foundAnswer[0].comments = [];
        this.updateById(questionID, foundQuestion).then(updatedQuestion => {
          res.status(200).json({
            success: true,
            data: updatedQuestion,
          });
        });
      });
    };

    /** Delete comment
     *  @param {Object} req - the request object
     *  @param {Object} res - the response object
     *  @param {Object} next- the next middleware in stack
     *  @returns {Object} Questions - the questions by category
     */
    this.deleteComments = (req, res, next) => {
      const { commentid, answerid, id } = req.params;
      const { comment } = req.body;
      const commentString = new Comment(comment, answerid);
      this.find(['question_id'], id).then(question => {
        const foundQuestion = question[0];
        const foundAnswer = foundQuestion.answers.filter(answer => {
          return answer.id === answerid;
        });
        const newComments = foundAnswer[0].comments.filter(comment => {
          return comment.id !== commentid;
        });

        const questionID = foundQuestion.id;

        foundAnswer[0].comments = newComments;
        // foundAnswer[0].comments = [];
        this.updateById(questionID, foundQuestion).then(updatedQuestion => {
          res.status(200).json({
            success: true,
            data: updatedQuestion,
          });
        });
      });
    };
  }
}

module.exports = FAQController;

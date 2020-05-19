'use strict';

const Answer = require('../models/AnswerModel');
const FAQAnswerModel = require('../models/FAQAnswerModel');
const FAQRouter = require('../router/FAQRouter');

/** Initialize Ansnwer Controller
 *  @kind class
 *  @extends AnswerModel
 */
module.exports = class AnswerController extends FAQAnswerModel {
  /** Initialize constructor */
  constructor() {
    super();

    /** Get all answers to a question
     *  @param {Object} req - the request object
     *  @param {Object} res - the response object
     *  @param {Object} next- the next middleware in stack
     *  @returns {Object} Questions - the question with answer included in array
     */

    this.getAllAnswers = (req, res, next) => {
      const parentID = req.params.id;

      this.find(['_parentQuestionID'], parentID).then(answers => {
        res.status(200).json({
          success: true,
          data: answers,
        });
      });
    };

    /** Post an answer to question
     *  @param {Object} req - the request object
     *  @param {Object} res - the response object
     *  @param {Object} next- the next middleware in stack
     *  @returns {Object} Questions - the question with answer included in array
     */
    this.postAnswer = (req, res, next) => {
      const parentID = req.params.id;
      // console.log(parentID);
      const answer = new Answer(req.body.answer, parentID);
      let questionObject = {};

      // get parent question Object

      // let questionID;
      // let foundQuestion = question[0];
      // questionID = foundQuestion.id;
      // foundQuestion.answers.push(answer.mapToModel());

      // this.updateById(questionID, foundQuestion)
      //   .then(response => {
      //     res.status(200).json({
      //       success: true,
      //       data: questionObject,
      //     });
      //   })
      //   .catch(next);
    };

    /** deleteAnswer
     *  @param {Object} req - the request object
     *  @param {Object} res - the response object
     *  @param {Object} next- the next middleware in stack
     *  @returns {Object} Questions - the questions by category
     */
    this.deleteAnswer = (req, res, next) => {
      const { answerid, id } = req.params;
      const { comment } = req.body;
      const commentString = new Comment(comment, answerid);
      this.find(['question_id'], id).then(question => {
        const foundQuestion = question[0];
        const newAnswers = foundQuestion.answers.filter(answer => {
          return answer.id !== answerid;
        });

        const questionID = foundQuestion.id;

        foundQuestion.answers = newAnswers;
        // foundAnswer[0].comments = [];
        this.updateById(questionID, foundQuestion).then(updatedQuestion => {
          res.status(200).json({
            success: true,
            data: updatedQuestion,
          });
        });
      });
    };

    /** Get Answer by ID
     *  @param {Object} req - the request object
     *  @param {Object} res - the response object
     *  @param {Object} next- the next middleware in stack
     *  @returns {Object} Questions - the questions by category
     */
    this.getAnswerById = (req, res, next) => {
      const { answerid, id } = req.params;
      this.find(['question_id'], id).then(question => {
        const foundAnswer = question[0].answers.filter(answer => {
          return answer.id === answerid;
        });

        res.status(200).json({
          success: true,
          data: foundAnswer,
        });
      });
    };

    /** Add rating to answer
     *  @param {Object} req - the request object
     *  @param {Object} res - the response object
     *  @param {Object} next- the next middleware in stack
     *  @returns {Object} Questions - the questions by category
     */
    this.addAnswerRating = (req, res, next) => {
      const { answerid, id } = req.params;
      const { rating } = req.body;
      this.find(['question_id'], id).then(question => {
        const foundQuestion = question[0];
        const foundAnswer = foundQuestion.answers.filter(answer => {
          return answer.id === answerid;
        });

        const questionID = foundQuestion.id;

        foundAnswer[0].ratings.push(Number.parseInt(rating));
        this.updateById(questionID, foundQuestion).then(updatedQuestion => {
          res.status(200).json({
            success: true,
            data: updatedQuestion,
          });
        });
      });
    };

    /** Add comments to answer
     *  @param {Object} req - the request object
     *  @param {Object} res - the response object
     *  @param {Object} next- the next middleware in stack
     *  @returns {Object} Questions - the questions by category
     */
    this.addAnswerComments = (req, res, next) => {
      const { answerid, id } = req.params;
      const { comment } = req.body;
      const commentString = new Comment(comment, answerid);
      this.find(['question_id'], id).then(question => {
        const foundQuestion = question[0];
        const foundAnswer = foundQuestion.answers.filter(answer => {
          return answer.id === answerid;
        });

        const questionID = foundQuestion.id;

        foundAnswer[0].comments.push(commentString.mapToModel());
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
};

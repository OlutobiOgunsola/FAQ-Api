'use strict';

const FAQModel = require('../models/FAQModel');
const Answer = require('../models/AnswerModel');
const Question = require('../models/QuestionModel');

/** Initialize FAQ Controller
 *  @kind class
 *  @extends FAQModel
 */

// Get all questions
// Get questions by category
// Get questions by id
// Post an answer
// Get an answer by id
// Add rating to question
// Add rating to answer
// Add comments to answer

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

      this.insert(question.mapToModel())
        .then(inserted => {
          res.status(200).json({
            success: true,
            data: inserted,
          });
        })
        .catch(next);
    };

    /** Post an answer to question
     *  @param {Object} req - the request object
     *  @param {Object} res - the response object
     *  @param {Object} next- the next middleware in stack
     *  @returns {Object} Questions - the question with answer included in array
     */

    this.postAnswer = (req, res, next) => {
      const parentID = req.params.id;
      const answer = new Answer(req.body.answer, parentID);

      //get parent question Object
      this.find(['question_id'], parentID)
        .then(question => {
          let questionID;
          let foundQuestion = question[0];
          questionID = foundQuestion.id;
          foundQuestion.answers.push(answer.mapToModel());

          this.updateById(questionID, foundQuestion).then(response => {
            res.status(200).json({
              success: true,
              data: response,
            });
          });
        })
        .catch(next);
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
          foundQuestion.ratings.push(rating);

          this.updateById(questionID, foundQuestion).then(response => {
            res.status(200).json({
              success: true,
              data: response,
            });
          });
        })
        .catch(next);
    };
  }
}

module.exports = FAQController;

/**
 * @typedef {Object} User
 * @property {string} _id
 * @property {string} email
 * @property {string} name
 * @property {string} role - 'learner', 'admin', 'superAdmin'
 * @property {string} profilePictureUrl
 * @property {number} solvedProblems
 * @property {number} submissionCount
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} AuthResponse
 * @property {User} user
 * @property {string} token
 * @property {string} message
 */

/**
 * @typedef {Object} AuthError
 * @property {string} error
 * @property {string} message
 */

export {};

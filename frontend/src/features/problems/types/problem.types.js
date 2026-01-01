/**
 * @typedef {Object} Problem
 * @property {string} _id
 * @property {string} title
 * @property {string} slug
 * @property {string} description
 * @property {string} difficulty - 'Easy', 'Medium', 'Hard'
 * @property {Array<string>} tags
 * @property {number} acceptanceRate
 * @property {number} submissions
 * @property {boolean} solved
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} ProblemListResponse
 * @property {Array<Problem>} items
 * @property {number} total
 * @property {number} page
 * @property {number} limit
 */

/**
 * @typedef {Object} ProblemFilters
 * @property {string} q - Search query
 * @property {string} difficulty - Filter by difficulty
 * @property {string} tags - Comma-separated tags
 * @property {number} page - Current page
 * @property {number} limit - Items per page
 * @property {string} sort - Sort field
 */

export {};

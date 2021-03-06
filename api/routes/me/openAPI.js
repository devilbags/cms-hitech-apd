const {
  requiresAuth,
  schema: { arrayOf, jsonResponse }
} = require('../openAPI/helpers');

const openAPI = {
  '/me': {
    get: {
      tags: ['Users'],
      summary: `Gets the current user's information`,
      description: `Get information about the current user`,
      responses: {
        200: {
          description: 'The current user',
          content: jsonResponse({
            type: 'object',
            properties: {
              activities: arrayOf({
                type: 'string',
                description: 'Names of system activities this user can perform'
              }),
              id: {
                type: 'number',
                description: `User's unique ID, used internally and for identifying the user when interacting with the API`
              },
              role: {},
              state: {
                type: 'object',
                description:
                  'The state/territory/district that this user is assigned to',
                properties: {
                  id: {
                    type: 'string',
                    description: 'Lowercase 2-letter code'
                  },
                  name: {
                    type: 'string',
                    description: 'State/territory/district full name'
                  }
                }
              },
              username: {
                type: 'string',
                description: `User's unique username (email address)`
              }
            }
          })
        }
      }
    }
  }
};

module.exports = requiresAuth(openAPI, { has401: false });

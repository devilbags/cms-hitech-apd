const tap = require('tap'); // eslint-disable-line import/no-extraneous-dependencies
const {
  db,
  getFullPath,
  login,
  request,
  unauthenticatedTest,
  unauthorizedTest
} = require('../../utils');

tap.test(
  'APD activity goals endpoint | PUT /activities/:id/goals',
  async putGoalsTest => {
    const url = activityID => getFullPath(`/activities/${activityID}/goals`);
    await db().seed.run();

    unauthenticatedTest('put', url(1), putGoalsTest);
    unauthorizedTest('put', url(1), putGoalsTest);

    putGoalsTest.test(
      'when authenticated as a user with permission',
      async authenticated => {
        const cookies = await login();

        authenticated.test(
          'with a non-existant activity ID',
          async invalidTest => {
            const { response, body } = await request.put(url(9000), {
              jar: cookies,
              json: true
            });

            invalidTest.equal(
              response.statusCode,
              404,
              'gives a 404 status code'
            );
            invalidTest.notOk(body, 'does not send a body');
          }
        );

        authenticated.test(
          `with an activity on an APD in a state other than the user's state`,
          async invalidTest => {
            const { response, body } = await request.put(url(4110), {
              jar: cookies,
              json: true
            });

            invalidTest.equal(
              response.statusCode,
              404,
              'gives a 404 status code'
            );
            invalidTest.notOk(body, 'does not send a body');
          }
        );

        authenticated.test(
          'with an array of goals with objectives',
          async validTest => {
            const { response, body } = await request.put(url(4100), {
              jar: cookies,
              json: true,
              body: [
                {
                  description: 'new goal 1',
                  objective: 'o1'
                }
              ]
            });

            validTest.equal(
              response.statusCode,
              200,
              'gives a 200 status code'
            );

            validTest.match(
              body,
              {
                id: 4100,
                name: 'Find Success',
                description: 'Some text goes here',
                expenses: [],
                goals: [
                  {
                    id: Number,
                    description: 'new goal 1',
                    objective: 'o1'
                  }
                ],
                schedule: []
              },
              'sends back the updated activity object'
            );
          }
        );
      }
    );
  }
);

// Public demo accounts published on the saucedemo.com login page. Not real secrets.
const PASSWORD = process.env.SAUCE_PASSWORD || 'secret_sauce';

module.exports = {
  users: {
    standard: { username: 'standard_user', password: PASSWORD },
    lockedOut: { username: 'locked_out_user', password: PASSWORD },
    problem: { username: 'problem_user', password: PASSWORD },
    performanceGlitch: { username: 'performance_glitch_user', password: PASSWORD },
  },
};

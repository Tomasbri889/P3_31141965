require('dotenv').config();
const app = require('./app');
const { sequelize, syncDB } = require('./models');

const port = process.env.PORT || 3000;

(async () => {
  try {
    await sequelize.authenticate();
    await syncDB();
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
      console.log(`Docs: /api-docs`);
    });
  } catch (err) {
    console.error('Failed to start', err);
    process.exit(1);
  }
})();

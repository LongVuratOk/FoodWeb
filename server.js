'use strict';

const app = require('./src/app');

const port = process.env.PORT || 3055;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

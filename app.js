const express = require('express');
require('./src/db/mongoose');
const taskRouter = require('./src/routers/task');
const userRouter = require('./src/routers/user');

const app = express();
const port = 3000;

app.use(express.json());
app.use(taskRouter);
app.use(userRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

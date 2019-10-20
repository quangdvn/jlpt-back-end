const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('morgan');
const databaseConnection = require('./configs/dbConnect').databaseConnection;

const exams = require('./routes/exams');
const skills = require('./routes/skills');
const parts = require('./routes/parts');
const mondais = require('./routes/mondais');
const sentences = require('./routes/sentences');
const questions = require('./routes/questions');
const answers = require('./routes/answers');
const choukais = require('./routes/choukais');
const registers = require('./routes/auth/register');
const logins = require('./routes/auth/login');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));

//* API Routes
app.use('/api/register', registers);
app.use('/api/login', logins);
app.use('/api/exams', exams);
app.use('/api/skills', skills);
app.use('/api/parts', parts);
app.use('/api/mondais', mondais);
app.use('/api/choukais', choukais);
app.use('/api/sentences', sentences);
app.use('/api/questions', questions);
app.use('/api/answers', answers);

databaseConnection();
const port = process.env.PORT || 8888;
app.listen(port, () => console.log(`Listening on port ${port}...`));

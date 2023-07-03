//It's a good practice to have everything that is related to express in one file and then everything that is related to the server in another main file so it's here where we listen to our server
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});
const app = require('./app.js');

process.on('uncaughtException', err => {
  console.log(err.name, err.errmsg);
  server.close(() => {
    console.log('Uncaught Exception 💥');
    process.exit(1);
  });
});

// console.log(app.get('env'));
// console.log(process.env);

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(con => console.log('\n\nconnection succesfully'));

//START SERVER
const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', err => {
  console.log(err.name, err.errmsg);
  server.close(() => {
    console.log('Unhandled Rejection 💥');
    process.exit(1);
  });
});

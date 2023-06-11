//It's a good practice to have everything that is related to express in one file and then everything that is related to the server in another main file so it's here where we listen to our server
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});
const app = require('./app.js');

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
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

//now we no longer run nodemon app.js but instead, we need to run server.js

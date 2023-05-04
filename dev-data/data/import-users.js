const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../../models/userModel');

dotenv.config({path: '../../config.env'});

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(con => console.log('\n\nconnection succesfully'));

const data = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));

const importData = async () => {
  try {
    await User.create(data);
    console.log('Data Loaded!');
  } catch (err) {
    console.log(err.message);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await User.deleteMany();
    console.log('Data Succesfully deleted!');
  } catch (err) {
    console.log(err.message);
  }
  process.exit();
};

if(process.argv[2] === '--import') {
  importData();
} else if(process.argv[2] === '--delete') {
  deleteData();
}

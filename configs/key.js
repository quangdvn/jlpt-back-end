require('dotenv').config();

module.exports = {
  MongoURL:
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@jlpt-database-3fdab.mongodb.net/JLPT-database`
};


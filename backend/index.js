require ('dotenv').config();
const port = process.env.PORT || 3001;
const server = require('./src/server.js');
const { conn } =  require('./src/db.js');  

conn.sync({ force: true }).then(() => {
  server.listen(port, () => {
    console.log(`Server listening at port ${port}`);
  });
})

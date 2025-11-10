var mysql      = require('mysql');
const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'unitconnects'
});

connection.connect();
if(connection){
    console.log("Database connected successfully");
}else{
    console.log("Database connection failed");
}
module.exports = connection;
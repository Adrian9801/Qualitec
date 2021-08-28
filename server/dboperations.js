var  config = require('./dbconfig');
const  sql = require('mssql');

async  function  getStudents() {
    try {
      let  pool = await  sql.connect(config);
      let  products = await  pool.request().query("SELECT * from estudiantes");
      return  products.recordsets;
    }
    catch (error) {
      console.log(error);
    }
}

async function getStudent(StudentId) {
    try {
      let  pool = await  sql.connect(config);
      let  product = await  pool.request()
      .input('input_parameter', sql.NVarChar, StudentId)
      .query("SELECT * from estudiantes where nombre = @input_parameter");
      return  product.recordsets;
    }
    catch (error) {
      console.log(error);
    }
}

async function addStudent(student) {
    try {
      let  pool = await  sql.connect(config);
      let  insertProduct = await  pool.request()
      .input('nombre', sql.NVarChar, student.nombre)
      .execute('InsertStudents');
      return  insertProduct.recordsets;
    }
    catch (err) {
      console.log(err);
    }
  }
  
  module.exports = {
    getStudents:  getStudents,
    getStudent:  getStudent,
    addStudent:  addStudent
  }
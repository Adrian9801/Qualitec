var  config = require('./dbconfig');
const  sql = require('mssql');
var jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
var user = [];
var token = '';
var secret = '';

async  function  getCourses() {
  try {
    let  pool = await  sql.connect(config);
    let  courses = await  pool.request().query("SELECT * from curso");
    return  courses.recordsets;
  }
  catch (error) {
    console.log(error);
  }
}

async function getCourse(CourseId) {
  try {
    let  pool = await  sql.connect(config);
    let  course = await  pool.request()
      .input('idC', sql.VarChar, CourseId)
      .query("SELECT * from curso where curso.codigo = @idC");
    return  course.recordsets;
  }
  catch (error) {
    console.log(error);
  }
}
 
async function addCourse(Course) {
  try {
    let  pool = await  sql.connect(config);
    let  insertCourse = await  pool.request()
      .input('codigo', sql.VarChar, Course.id)
      .input('nombre', sql.VarChar, Course.name)
      .input('creditos', sql.Int, Course.credits)
      .execute('InsertCourse');
      return  insertCourse.recordsets;
  }
  catch (err) {
    console.log(err);
  }
}

async function getGroups() {
  try {
    let  pool = await  sql.connect(config);
    let  groups = await  pool.request().query("SELECT * from grupo");
    return  groups.recordsets;
  }
  catch (error) {
    console.log(error);
  }
}

async function getGroup(CourseId, GroupId) {
  try {
    let  pool = await  sql.connect(config);
    let  group = await  pool.request()
      .input('idG', sql.Int, GroupId)
      .input('idC', sql.VarChar, CourseId)
      .query("SELECT * from grupo where codigo = @idG and codigo_curso = @idC");
    return  group.recordsets;
  }
  catch (error) {
    console.log(error);
  }
}

async function getGroupsCourse(CourseId) {
  try {
    let  pool = await  sql.connect(config);
    let  group = await  pool.request()
      .input('idC', sql.VarChar, CourseId)
      .query("SELECT * from grupo where codigo_curso = @idC");
    return  group.recordsets;
  }
  catch (error) {
    console.log(error);
  }
}

async function loginUser(userData) {
  try {
    //console.log(await bcryptjs.hashSync(userData.pass,8));
    let  pool = await  sql.connect(config);
    let  userLogin = (await  pool.request()
      .input('correo', sql.VarChar, userData.correo)
      .query("SELECT * from administrador where administrador.correo = @correo")).recordsets;
    if(userLogin[0].length != 0 && (await bcryptjs.compare(userData.pass,userLogin[0][0].contrasena))){
      secret = (await bcryptjs.hashSync(Date.now()+'',8));
      token = jwt.sign({  user: userLogin[0][0].id }, secret, { expiresIn: '1h' });
      userLogin[0].push({student:false});
      user = userLogin[0];
    }
    else{
      userLogin = (await  pool.request()
      .input('correo', sql.VarChar, userData.correo)
      .query("SELECT * from estudiante where estudiante.correo = @correo")).recordsets;
      if(userLogin[0].length != 0 && (await bcryptjs.compare(userData.pass,userLogin[0][0].contrasena))){
        secret = (await bcryptjs.hashSync(Date.now()+'',8));
        token = jwt.sign({  user: userLogin[0][0].id }, secret, { expiresIn: '1h' });
        userLogin[0].push({student:true});
        user = userLogin[0];
      }
    }
    return userLogin[0];
  }
  catch (error) {
    console.log(error);
  }
}

async function checkLogIn() {
  try {
    jwt.verify(token, secret); // .user => id
    return true;
  } catch (error) {
    return false;
  }
}

async function getUser() {
  try {
    return user;
  }
  catch (error) {
    console.log(error);
  }
}

async function logout() {
  token = '';
  secret = '';
  user = [];
  return true;
}
 
async function addGroup(Group) {
  try {
    let  pool = await  sql.connect(config);
    let  insertGroup = await  pool.request()
      .input('idCourse', sql.VarChar, Group.idCourse)
      .input('id', sql.Int, Group.id)
      .input('teacher', sql.VarChar, Course.teacher)
      .input('places', sql.Int, Course.places)
      .execute('InsertCourse');
      return  insertGroup.recordsets;
  }
  catch (err) {
    console.log(err);
  }
}

async function getGroupsCourseSP(CourseId) {
  try {
    let  pool = await  sql.connect(config);
    let  group = await  pool.request()
      .input('idC', sql.VarChar, CourseId)
      .query("EXEC obtenerGruposCurso @idCourse = @idC");
    return  group.recordsets;
  }
  catch (error) {
    console.log(error);
  }
}
  
module.exports = {
  getCourses:  getCourses,
  getCourse:  getCourse,
  addCourse:  addCourse,
  getGroups:  getGroups,
  getGroup:  getGroup,
  addGroup:  addGroup,
  getGroupsCourse: getGroupsCourse,
  getGroupsCourseSP: getGroupsCourseSP,
  loginUser: loginUser,
  checkLogIn: checkLogIn,
  logout: logout,
  getUser: getUser
}
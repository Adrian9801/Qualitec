var  config = require('./dbconfig');
const  sql = require('mssql');
var jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
var token = '';
var secret = '';

async  function  getCourses() {
  try {
    let  pool = await  sql.connect(config);
    let  courses = await  pool.request().query("SELECT * from courses");
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
      .query("SELECT * from courses where courses.id = @idC");
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
      .input('id', sql.VarChar, Course.id)
      .input('name', sql.VarChar, Course.name)
      .input('credits', sql.Int, Course.credits)
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
    let  groups = await  pool.request().query("SELECT * from groups");
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
      .query("SELECT * from groups where id = @idG and idCourse = @idC");
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
      .query("SELECT * from groups where idCourse = @idC");
    return  group.recordsets;
  }
  catch (error) {
    console.log(error);
  }
}

async function loginUser(userData) {
  try {
    let  pool = await  sql.connect(config);
    let  userLogin = (await  pool.request()
      .input('user', sql.VarChar, userData.user)
      .query("SELECT * from users where users.[user] = @user")).recordsets;
    if(userLogin[0].length != 0 && (await bcryptjs.compare(userData.password,userLogin[0][0].pass))){
      secret = (await bcryptjs.hashSync(Date.now()+'',8));
      token = jwt.sign({  user: userLogin[0][0].id }, secret, { expiresIn: '1h' });
    }
    return checkLogIn();
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

async function logout() {
  token = '';
  secret = '';
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
  logout: logout
}
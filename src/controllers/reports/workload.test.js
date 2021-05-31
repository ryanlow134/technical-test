// import { insert } from './../register';
import { getJson } from './workload'
import sequelize from '../../config/database';
// import { DataTypes } from 'sequelize';

describe('Test Register', () => {

  // //DEFINE TEACHER TABLE
  // const teacherDb = sequelize.define('teacher', {
  //   email: {
  //     type: DataTypes.STRING,
  //     allowNull: false,
  //     primaryKey: true
  //   },
  //   name: {
  //     type: DataTypes.STRING
  //   }
  // }, {
  //   tableName: 'teacher'
  // });

  // //DEFINE CLASS TABLE
  // const classDb = sequelize.define('class', {
  //   classCode: {
  //     type: DataTypes.STRING,
  //     allowNull: false,
  //     primaryKey: true
  //   },
  //   name: {
  //     type: DataTypes.STRING
  //   }
  // }, {
  //   tableName: 'class'
  // });

  // //DEFINE SUBJECT TABLE
  // const subjectDb = sequelize.define('subject', {
  //   subjectCode: {
  //     type: DataTypes.STRING,
  //     allowNull: false,
  //     primaryKey: true
  //   },
  //   name: {
  //     type: DataTypes.STRING
  //   }
  // }, {
  //   tableName: 'subject'
  // });

  // //DEFINE TEACHER-CLASS-SUBJECT TABLE
  // const tcsDb = sequelize.define('tcs', {
  //   email: {
  //     type: DataTypes.STRING,
  //     allowNull: false
  //   },
  //   classCode: {
  //     type: DataTypes.STRING,
  //     allowNull: false
  //   },
  //   subjectCode: {
  //     type: DataTypes.STRING,
  //     allowNull: false
  //   }
  // }, {
  //   tableName: 'tcs'
  // });

  // const req = {
  //   body: {
  //     'teacher': {
  //       'name': 'Teacher 1',
  //       'email': 'teacher1@gmail.com'
  //     },
  //     'students': [
  //       {
  //         'name': 'Student 1',
  //         'email': 'student1@gmail.com'
  //       },
  //       {
  //         'name': 'Student B',
  //         'email': 'student2@gmail.com'
  //       }
  //     ],
  //     'subject': {
  //       'subjectCode': 'MAT',
  //       'name': 'Maths'
  //     },
  //     'class': {
  //       'classCode': 'P1-1',
  //       'name': 'P1 Integrity'
  //     }
  //   }
  // }

  // const teacher = req.teacher;
  // const classes = req.class;
  // const subject = req.subject;

  beforeEach(async () => {
    await sequelize.sync();

    // await insert(teacher, teacherDb, 'teacher');
    // await insert(subject, subjectDb, 'subject');
    // await insert(classes, classDb, 'classes');
    // await insert({teacher, classes, subject}, tcsDb, 'tcs');
  });

  afterEach(async () => {
    return await sequelize.dropAllSchemas({});
  });

  test('Database Returns JSON', async () => {
    var response = await getJson([]);
    expect(response).toBe(500)
  });
});

import { insert, update } from './register';
import sequelize from '../config/database';
import { DataTypes } from 'sequelize';

describe('Test Register', () => {

  const obj = {
    'name': 'Teacher 1',
    'email': 'teacher1@gmail.com'
  }

  const objErr = {
    'nameErr': 'Teacher 1',
    'emailErr': 'teacher1@gmail.com'
  }

  const teacherDb = sequelize.define('teacher', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING
    }
  }, {
    tableName: 'teacher'
  });

  const type = 'teacher'
  const typeErr = 'abc'

  beforeAll(async () => {
    await sequelize.sync();
  });

  afterAll(async () => {
    await sequelize.dropAllSchemas({});
  });

  test('Test Insert (Success)', async () => {
    var responseInsert = await insert(obj, teacherDb, type);
    expect(responseInsert).toBe(true)
  });

  test('Test Insert (Wrong Type)', async () => {
    var responseInsert = await insert(obj, teacherDb, typeErr);
    expect(responseInsert).toBe(0)
  });

  test('Test Insert (Wrong Obj Format)', async () => {
    var responseInsert = await insert(objErr, teacherDb, type);
    expect(responseInsert).toBe(0)
  });

  test('Test Update', async () => {
    var responseUpdate = await update(obj, teacherDb, { 'email': 'teacher1@gmail.com' });
    expect(responseUpdate).toBe(0)
  });
})

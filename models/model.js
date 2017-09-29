const Sequelize = require('sequelize');
const sequelize = new Sequelize(
  'board', // 데이터베이스 이름
  'test1', // 유저명
  '1234', // 비밀번호
  {
    'host': '211.253.9.163', // 데이터베이스 호스트
    'dialect': 'mysql' // 사용할 데이터베이스 종류
  }
)

//관계정의-table 생성
// const name = sequelize.define('table', {
//     id: {
//       type: Sequelize.INTEGER,
//       primaryKey: true,
//       autoIncrement: true
//     },
//     title: {
//       type: Sequelize.STRING,
//       allowNull: true
//     },
//     body: {
//       type: Sequelize.TEXT,
//       allowNull: true
//     }
//   });
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('tos_management_db', 'tos_user', 'tos_pass', {
    host: '127.0.0.1',
    dialect: 'mysql',
    port: 3307,
    logging: false
});

export default sequelize;

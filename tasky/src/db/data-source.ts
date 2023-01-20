import { DataSource, DataSourceOptions } from "typeorm";


export const dataSourceOptions: DataSourceOptions = {
    
    type: 'postgres',
    host: 'localhost',
    port: +process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/db/migrations/*.js'],

}

const dataSource = new DataSource(dataSourceOptions);



export default dataSource
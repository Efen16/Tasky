import { DataSource, DataSourceOptions } from "typeorm";

export let dataSourceOptions:DataSourceOptions;

if(process.env.NODE_ENV ==='production'){
       dataSourceOptions = {
            type: 'postgres',
            host: 'localhost',
            port: +process.env.DB_PORT,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            entities: ['dist/**/*.entity.js'],
            migrations: ['dist/db/migrations/*.js'],
    }
}else{
       dataSourceOptions = {
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'postgres',
            password: 'admin',
            database: 'project_managment',
            entities: ['dist/**/*.entity.js'],
            migrations: ['dist/db/migrations/*.js'],
    }
}



const dataSource = new DataSource(dataSourceOptions);



export default dataSource
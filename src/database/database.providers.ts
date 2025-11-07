import { Analitic } from "src/analitics/entities/analitic.entity";
import { Project } from "src/models/project";
import { User } from "src/models/user";

export const databaseProviders = [
    {
        provide: 'SEQUELIZE',
        useFactory: async () => {
            const { Sequelize } = require('sequelize-typescript');
            const sequelize = new Sequelize({
                dialect: 'mysql',
                host: process.env.DB_HOST,
                port: process.env.DB_PORT,
                username: process.env.DB_USER,
                password: '',
                database: process.env.DB_NAME,
                models: [User, Project,Analitic],
            });
            sequelize.addModels([User, Project,Analitic]);
            await sequelize.sync();
            return sequelize;
        },
    },
];
import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({
    tableName: 'Projects',
    timestamps: true,
})
export class Project extends Model {
    @Column({
        type: DataType.UUID,
        primaryKey: true,
    })
    declare id: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare title: string;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    declare description: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    declare github?: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    declare link?: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    declare image?: string;
    
    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    declare imagePublicId?: string;

}

import {  Column, DataType, Model, Table } from "sequelize-typescript";

 
@Table({
    tableName: 'Analitics',
    timestamps: true
})
export class Analitic extends Model{
    @Column({
        type: DataType.INTEGER,
        primaryKey:true,
        autoIncrement:true
    })
    declare id:number

    @Column({
        type: DataType.INTEGER,
        allowNull:false
    })
    declare viewer: number
}

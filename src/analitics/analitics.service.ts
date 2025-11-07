import { Inject, Injectable } from '@nestjs/common';
import { CreateAnaliticDto } from './dto/create-analitic.dto';
import { UpdateAnaliticDto } from './dto/update-analitic.dto';
import { Analitic } from './entities/analitic.entity';

@Injectable()
export class AnaliticsService {

  constructor
  (@Inject('ANALITIC_REPOSITORY') private readonly analiticProvider: typeof Analitic,
  
)
  {}
  create(createAnaliticDto: CreateAnaliticDto) {
    return 'This action adds a new analitic';
  }

  async findAll() {
    return await this.analiticProvider.findAll();
  }

  findOne(id: number) {
    return `This action returns a #${id} analitic`;
  }

 async  update(id: number, updateAnaliticDto: UpdateAnaliticDto) {
    return await this.analiticProvider.update(updateAnaliticDto,{where:{id}}) ;
  }

  remove(id: number) {
    return `This action removes a #${id} analitic`;
  }

  async addViewer(){
    const all= await this.findAll();
    const viewer=all[0].viewer + 1;
    return await this.update(all[0].id,{viewer})

  }
}

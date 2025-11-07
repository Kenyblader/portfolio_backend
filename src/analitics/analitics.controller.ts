import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AnaliticsService } from './analitics.service';
import { CreateAnaliticDto } from './dto/create-analitic.dto';
import { UpdateAnaliticDto } from './dto/update-analitic.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('analitics')
export class AnaliticsController {
  constructor(private readonly analiticsService: AnaliticsService) {}

  @Post()
  create(@Body() createAnaliticDto: CreateAnaliticDto) {
    return this.analiticsService.create(createAnaliticDto);
  }

  @UseGuards(AuthGuard)
  @Post('/viewer')
  addViewer(){
    return this.analiticsService.addViewer();
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll() {
    const analitics= await this.analiticsService.findAll();
    return analitics[0];
  }
  

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.analiticsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAnaliticDto: UpdateAnaliticDto) {
    return this.analiticsService.update(+id, updateAnaliticDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.analiticsService.remove(+id);
  }
}

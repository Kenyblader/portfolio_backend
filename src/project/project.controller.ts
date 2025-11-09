import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, FileTypeValidator, MaxFileSizeValidator, ParseFilePipe, UseGuards } from '@nestjs/common';
import { ProjectService } from './project.service';
import { Project } from 'src/models/project';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { ProjectDto } from 'src/models/project.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @UseInterceptors(FileInterceptor('img'))
  @UseGuards(AuthGuard)
  create(
    @Body() params,
    @Body('title') title: string,
    @Body('description') description: string,
    @Body('date') date: Date,

    @Body('github') github?: string,
    @Body('link') link?: string,
    
  @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5000000 }), // 5MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif|webp)$/ }),
        ],
        fileIsRequired: false,
      }),
    ) image?: Express.Multer.File) {
    const project: ProjectDto = {
      title,
      description,  
      date,
      github,
      link,
    };
    return this.projectService.create(project,image);
  }

  @Get()
  findAll() {
    return this.projectService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectService.findOne(+id);
  }
  
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: Partial<ProjectDto>) {
    return this.projectService.update(+id, updateProjectDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectService.remove(id);
  }
}

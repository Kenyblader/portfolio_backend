import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { existsSync, mkdirSync } from 'fs';
import {v4 as uuid} from 'uuid';
import { promises as fs } from 'fs';
import { join } from 'path';
import { Project } from 'src/models/project';
import { ProjectDto } from 'src/models/project.dto';
import { ConfigService } from '@nestjs/config';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class ProjectService {

  // private readonly uploadPath = join(process.cwd(), 'uploads', 'projects');
  
  constructor(
    @Inject('PROJECT_REPOSITORY') private projectRepository: typeof Project,
    private cloudinaryService: CloudinaryService
  ) {
  }


  async create(project: ProjectDto, img?: Express.Multer.File) {

    let imgPath:string=''
    let imgPublicId:string=''
    if (img) {
      const imgData= await this.cloudinaryService.uplaodFile(img);
      imgPath= imgData.secure_url;
      imgPublicId=imgData.public_id;
    }
    const newProject = await this.projectRepository.create(
      {id: uuid(),
        ...project, 
        image: imgPath==''?null:imgPath,
        imagePublicId: imgPublicId==''?null:imgPublicId
      });
    return newProject;
  }

 async findAll(): Promise<ProjectDto[]> {
   const projects = await this.projectRepository.findAll();
   return Promise.all(projects.map(async project => {
      if (project.image) {
        return {
          ...project.toJSON(),
          date: new Date(project.createdAt),
        };
      } else {
        return {
          ...project.toJSON(),
          date: new Date(project.createdAt),
        };
      }
   }));
 }

  async findOne(id: number): Promise<ProjectDto> {
    const project = await this.projectRepository.findOne({ where: { id } });
    if (project && project.image) {
      return {
        ...project.toJSON(),
        date: new Date(project.createdAt),
      };
    }
    if (project) {
      return {
        ...project.toJSON(),
        date: new Date(project.createdAt),  
      };
    }
    throw new Error('Project not found');
  }

  update(id: number, updateProjectDto: Partial<Project>) {
    return this.projectRepository.update(updateProjectDto, { where: { id } });
  }

  async remove(id: string) : Promise<number> {
    const project = await this.projectRepository.findOne({ where: { id } });
    if (project && project.imagePublicId) { 
      await this.cloudinaryService.deleteImage(project.imagePublicId);
    }
    
    return this.projectRepository.destroy({ where: { id } });
  }
}



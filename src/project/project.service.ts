import { Inject, Injectable } from '@nestjs/common';
import {v4 as uuid} from 'uuid';
import { Project } from 'src/models/project';
import { ProjectDto } from 'src/models/project.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CloudinaryResponse } from 'src/cloudinary/cloudinary/cloudinary-response';

@Injectable()
export class ProjectService {

  constructor(
    @Inject('PROJECT_REPOSITORY') private projectRepository: typeof Project,
    private cloudinaryService: CloudinaryService
  ) {
  }


  async create(project: ProjectDto, img?: Express.Multer.File) {

    let imgPath:string=''
    let imgPublicId:string=''
    if (img) {
      const imgData= await this.cloudinaryService.uploadFile(img);
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

  async update(id: string, updateProjectDto: Partial<Project>, img?: Express.Multer.File) {
    if(!updateProjectDto || Object.keys(updateProjectDto).length === 0 && !img) {
      return ;
    }
    const project = await this.projectRepository.findOne({ where: { id } });

    if (project) {
      if (img) {
        let imgData: CloudinaryResponse;
        if (project.imagePublicId) {
          imgData = await this.cloudinaryService.replaceImage(project.imagePublicId, img);
        } else {
          imgData = await this.cloudinaryService.uploadFile(img);
        }

        updateProjectDto.image = imgData.secure_url;
        updateProjectDto.imagePublicId = imgData.public_id;
      }
      return this.projectRepository.update(updateProjectDto, { where: { id } });
    }
    throw new Error('Project not found');
  }

  async remove(id: string) : Promise<number> {
    const project = await this.projectRepository.findOne({ where: { id } });
    if (project && project.imagePublicId) { 
      await this.cloudinaryService.deleteImage(project.imagePublicId);
    }
    
    return this.projectRepository.destroy({ where: { id } });
  }
}



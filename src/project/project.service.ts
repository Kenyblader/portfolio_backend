import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { existsSync, mkdirSync } from 'fs';
import {v4 as uuid} from 'uuid';
import { promises as fs } from 'fs';
import { join } from 'path';
import { Project } from 'src/models/project';
import { ProjectDto } from 'src/models/project.dto';
import { ConfigService } from '@nestjs/config';
import { get } from 'http';

@Injectable()
export class ProjectService {

  private readonly uploadPath = join(process.cwd(), 'uploads', 'projects');
  
  constructor(
    @Inject('PROJECT_REPOSITORY') private projectRepository: typeof Project,
    private configService: ConfigService,
  ) {
    if (!existsSync(this.uploadPath)) {
      mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  toBase64(filePath: string): Promise<string> {
    const imgBuffer = fs.readFile(filePath);
    const imgBase64 = imgBuffer.then(buffer => buffer.toString('base64'));
    return imgBase64;
  }

  getPublicImageURL(localPath: string): string {
    
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    const fileUrl = `${baseUrl}/files/${localPath}`;
    return fileUrl;
  }

  async create(project: ProjectDto, img?: Express.Multer.File) {

    let imgPath:string=''
    if (img) {
      const fileExtension = img.originalname.split('.').pop();
      const filename = `${uuid()}.${fileExtension}`;
      const filePath = join(this.uploadPath, filename);
      await fs.writeFile(filePath, img.buffer);
      imgPath = `projects/${filename}`;
    }
    console.log("imgPath",imgPath)
    const newProject = await this.projectRepository.create({id: uuid(), ...project, image: imgPath==''?null:imgPath});
    return newProject;
  }

 async findAll(): Promise<ProjectDto[]> {
   const projects = await this.projectRepository.findAll();
   return Promise.all(projects.map(async project => {
      if (project.image) {
        return {
          ...project.toJSON(),
          image: this.getPublicImageURL(project.image),
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
        image: this.getPublicImageURL(project.image),
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
    if (project && project.image) { 
      await fs.unlink(join(process.cwd(),'uploads', project.image));
    }
    return this.projectRepository.destroy({ where: { id } });
  }
}



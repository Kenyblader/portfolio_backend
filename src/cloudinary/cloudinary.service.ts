import { Injectable } from '@nestjs/common';
import { v2 as cloudinary} from 'cloudinary'
import { CloudinaryResponse } from './cloudinary/cloudinary-response';
const streamifier= require('streamifier');

@Injectable()
export class CloudinaryService {
    async uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse>
    {
        return new Promise((resolve,reject)=>{
            const uploadStream= cloudinary.uploader.upload_stream(
                {
                    folder: 'portfolio',
                    resource_type:'image',
                    transformation:{
                        quality:'auto'
                    }
                },
                (error,result)=>{
                    if(error)  return reject(error);
                    resolve(result as CloudinaryResponse);
                },
            );

            streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
    }

    /**
     * Remplacer une image de Cloudinary
     */
    async replaceImage(publicId: string, file: Express.Multer.File): Promise<CloudinaryResponse> {
        await this.deleteImage(publicId);
        return this.uploadFile(file);
    }

        /**
     * Supprimer une image de Cloudinary
     */
    async deleteImage(publicId: string): Promise<void> {
        await cloudinary.uploader.destroy(publicId);
    }

    /**
     * Obtenir l'URL optimisée
     */
    getOptimizedUrl(publicId: string, options?: any): string {
        return cloudinary.url(publicId, {
        fetch_format: 'auto',
        quality: 'auto',
        ...options,
        });
    }
}

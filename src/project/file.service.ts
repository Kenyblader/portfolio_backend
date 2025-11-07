import { Injectable, BadRequestException } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';
import { v4 as uuid } from 'uuid';
import { existsSync, mkdirSync } from 'fs';

@Injectable()
export class FileStorageService {
  private readonly uploadPath = join(process.cwd(), 'uploads');

  constructor() {
    // Créer le dossier uploads s'il n'existe pas
    this.ensureUploadDirExists();
  }

  private ensureUploadDirExists() {
    if (!existsSync(this.uploadPath)) {
      mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  /**
   * Sauvegarder un fichier dans un dossier spécifique
   */
  async saveFile(
    file: Express.Multer.File,
    folder: string,
  ): Promise<string> {
    if (!file) {
      throw new BadRequestException('Aucun fichier fourni');
    }

    // Valider le type de fichier
    this.validateFileType(file);

    // Créer le dossier de destination s'il n'existe pas
    const destinationPath = join(this.uploadPath, folder);
    if (!existsSync(destinationPath)) {
      mkdirSync(destinationPath, { recursive: true });
    }

    // Générer un nom unique
    const fileExtension = file.originalname.split('.').pop();
    const filename = `${uuid()}.${fileExtension}`;
    const filePath = join(destinationPath, filename);

    // Sauvegarder le fichier
    await fs.writeFile(filePath, file.buffer);

    // Retourner le chemin relatif
    return `${folder}/${filename}`;
  }

  /**
   * Récupérer un fichier
   */
  async getFile(relativePath: string): Promise<Buffer> {
    const filePath = join(this.uploadPath, relativePath);

    if (!existsSync(filePath)) {
      throw new BadRequestException('Fichier non trouvé');
    }

    return await fs.readFile(filePath);
  }

  /**
   * Supprimer un fichier
   */
  async deleteFile(relativePath: string): Promise<void> {
    if (!relativePath) return;

    const filePath = join(this.uploadPath, relativePath);

    if (existsSync(filePath)) {
      try {
        await fs.unlink(filePath);
      } catch (error) {
        console.error('Erreur lors de la suppression du fichier:', error);
      }
    }
  }

  /**
   * Vérifier si un fichier existe
   */
  fileExists(relativePath: string): boolean {
    const filePath = join(this.uploadPath, relativePath);
    return existsSync(filePath);
  }

  /**
   * Obtenir le chemin complet du fichier
   */
  getFilePath(relativePath: string): string {
    return join(this.uploadPath, relativePath);
  }

  /**
   * Valider le type de fichier (images uniquement)
   */
  private validateFileType(file: Express.Multer.File): void {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Type de fichier non autorisé. Seules les images sont acceptées.',
      );
    }

    // Vérifier la taille (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException(
        'Fichier trop volumineux. Taille maximale : 5MB',
      );
    }
  }

  /**
   * Générer l'URL complète du fichier
   */
  getFileUrl(relativePath: string, baseUrl?: string): string {

    const base = baseUrl || process.env.API_URL || 'http://localhost:3000';
    return `${base}/uploads/${relativePath}`;
  }
}
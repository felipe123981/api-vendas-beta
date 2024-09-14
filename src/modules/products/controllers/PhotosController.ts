import { Request, Response } from 'express';
import AddProductPhotoService from '../services/AddProductPhotoService';
import DeleteProductPhotoService from '../services/DeleteProductPhotoService';
import UploadProductPhotosService from '../services/UploadProductPhotosService';

export default class PhotosController {
  public async upload(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const photoFilenames: string[] = (request.files as Array<any>).map(
      (file: any) => file.filename,
    );

    const uploadPhotos = new UploadProductPhotosService();

    const product = await uploadPhotos.execute({
      id,
      photoFilenames,
    });
    return response.json(product);
  }
  public async add(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const user_id = request.user.id;

    const addPhoto = new AddProductPhotoService();

    const product = await addPhoto.execute({
      id,
      photoFilename: request.file?.filename as string,
      user_id,
    });

    return response.json(product);
  }

  public async remove(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const user_id = request.user.id;

    const deletePhoto = new DeleteProductPhotoService();

    await deletePhoto.execute({
      id,
      photoFilename: request.file?.filename as string,
      user_id,
    });

    return response.json([]);
  }
}

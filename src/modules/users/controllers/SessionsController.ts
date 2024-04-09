import { Request, Response } from 'express';
import CreateSessionsService from '../services/CreateSessionsService';
import { instanceToInstance } from 'class-transformer';
export default class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const createSession = new CreateSessionsService();

    const user = await createSession.execute({
      email,
      password,
    });

    const { method, url, ip } = request;
    console.log(
      `[+] Session Required: \n  =>at: [${new Date().toISOString()}]\n  =>method: ${method}\n  =>url: ${url}\n  =>email: ${email}\n  =>from ${ip}`,
    );

    return response.json(instanceToInstance(user));
  }
}

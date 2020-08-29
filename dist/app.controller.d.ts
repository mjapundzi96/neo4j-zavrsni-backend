import { AppService } from './app.service';
import { Genre } from './models';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): Promise<string>;
    getUsersAlsoViewed(request: any): Promise<Genre[]>;
}

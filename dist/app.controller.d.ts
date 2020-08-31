import { AppService } from './app.service';
import { Genre } from './models';
import { SearchAllFilterDto } from './search-all-filter.dto';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): Promise<string>;
    getUsersAlsoViewed(request: any): Promise<Genre[]>;
    searchAll(searchAllFilterDto: SearchAllFilterDto): Promise<(Partial<import("./models/artist.model").Artist> | Partial<import("./models").Song> | Partial<import("./models").Album>)[]>;
}

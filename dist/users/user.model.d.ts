export declare class User {
    id: number;
    username: string;
    password: string;
    salt: string;
    favorite_genres: number[];
    validatePassword(password: string): Promise<boolean>;
}

export declare class User {
    id: number;
    username: string;
    password: string;
    salt: string;
    validatePassword(password: string): Promise<boolean>;
}

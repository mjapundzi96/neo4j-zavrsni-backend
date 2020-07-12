import * as bcrypt from 'bcrypt'

export class User {
    id: number;
    username: string;
    password?: string;
    salt?: string;
    favorite_genres?: number[]
    async validatePassword(password: string): Promise<boolean> {
        const hash = await bcrypt.hash(password, this.salt);
        return hash === this.password
    }
}
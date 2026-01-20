export type Category = 'all' | 'social' | 'work' | 'finance' | 'personal';

export interface PasswordEntry {
    title: string;
    username: string;
    password: string;
    url?: string;
    category: Category;
}

export interface PasswordEntryWithId extends PasswordEntry {
    _id: string;
}

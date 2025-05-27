import fs from 'fs/promises';
import path from 'path';

/**
 * Stores a JavaScript object in a JSON file.
 * @param filePath - Path to the JSON file.
 * @param data - The object to store.
 */
export async function storeObject<T extends object>(filePath: string, data: T): Promise<void> {
        const fullPath = path.resolve(filePath);
        const json = JSON.stringify(data, null, 2);
        await fs.writeFile(fullPath, json, 'utf-8');
}

/**
 * Retrieves a JavaScript object from a JSON file.
 * @param filePath - Path to the JSON file.
 * @returns The parsed object, or null if file doesn't exist.
 */
export async function retrieveObject<T extends object>(filePath: string): Promise<T | null> {
        const fullPath = path.resolve(filePath);
        try {
                const fileContent = await fs.readFile(fullPath, 'utf-8');
                return JSON.parse(fileContent) as T;
        } catch (err: any) {
                if (err.code === 'ENOENT') {
                        return null; // File doesn't exist
                }
                throw err;
        }
}


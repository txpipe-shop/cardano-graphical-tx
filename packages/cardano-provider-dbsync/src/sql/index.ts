import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class SQLQueryLoader {
  private queries: Map<string, string> = new Map();
  private queriesDir: string;

  constructor() {
    this.queriesDir = path.join(__dirname, 'queries');
  }

  /**
   * Get a SQL query by name.
   * The name corresponds to the .sql file name without extension.
   * @param name - Query name (e.g., 'tx_by_hash' loads 'tx_by_hash.sql')
   */
  get(name: string): string {
    if (this.queries.has(name)) {
      return this.queries.get(name)!;
    }

    const filePath = path.join(this.queriesDir, `${name}.sql`);

    if (!fs.existsSync(filePath)) {
      throw new Error(`SQL query not found: ${name} (looked for ${filePath})`);
    }

    const query = fs.readFileSync(filePath, 'utf-8');
    this.queries.set(name, query);
    return query;
  }

  /**
   * Preload all SQL queries from the queries directory.
   * Call this at startup for better performance.
   */
  preloadAll(): void {
    if (!fs.existsSync(this.queriesDir)) {
      return;
    }

    const files = fs.readdirSync(this.queriesDir);
    for (const file of files) {
      if (file.endsWith('.sql')) {
        const name = file.replace('.sql', '');
        this.get(name);
      }
    }
  }

  clear(): void {
    this.queries.clear();
  }
}

export const SQLQuery = new SQLQueryLoader();

/**
 * Archetype Storage Layer
 * Provides persistent storage and retrieval of archetypes
 * Supports both file-based and database backends
 */

import { Archetype } from './types';

/**
 * Abstract storage interface for archetype persistence
 */
export interface IArchetypeStorage {
  save(archetype: Archetype): Promise<void>;
  load(id: string): Promise<Archetype | null>;
  loadAll(): Promise<Archetype[]>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
  search(query: string): Promise<Archetype[]>;
  update(archetype: Archetype): Promise<void>;
}

/**
 * In-memory storage implementation (for development/testing)
 */
export class InMemoryArchetypeStorage implements IArchetypeStorage {
  private store: Map<string, Archetype> = new Map();

  async save(archetype: Archetype): Promise<void> {
    this.store.set(archetype.id, archetype);
  }

  async load(id: string): Promise<Archetype | null> {
    return this.store.get(id) || null;
  }

  async loadAll(): Promise<Archetype[]> {
    return Array.from(this.store.values());
  }

  async delete(id: string): Promise<void> {
    this.store.delete(id);
  }

  async exists(id: string): Promise<boolean> {
    return this.store.has(id);
  }

  async search(query: string): Promise<Archetype[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.store.values()).filter(
      (a) =>
        a.name.toLowerCase().includes(lowerQuery) ||
        a.description.toLowerCase().includes(lowerQuery) ||
        a.primaryUseCase.toLowerCase().includes(lowerQuery)
    );
  }

  async update(archetype: Archetype): Promise<void> {
    if (!this.store.has(archetype.id)) {
      throw new Error(`Archetype not found: ${archetype.id}`);
    }
    this.store.set(archetype.id, archetype);
  }

  async clear(): Promise<void> {
    this.store.clear();
  }
}

/**
 * File-based storage implementation (for local development)
 * Stores archetypes as JSON files in a directory
 */
export class FileArchetypeStorage implements IArchetypeStorage {
  private baseDir: string;
  private indexFile: string;
  private index: Map<string, string> = new Map(); // id -> filename mapping

  constructor(baseDir: string = './data/archetypes') {
    this.baseDir = baseDir;
    this.indexFile = `${baseDir}/index.json`;
  }

  async save(archetype: Archetype): Promise<void> {
    // In a real implementation, this would write to the file system
    // For now, we'll use in-memory storage as a placeholder
    this.index.set(archetype.id, `${archetype.id}.json`);
  }

  async load(id: string): Promise<Archetype | null> {
    // In a real implementation, this would read from the file system
    const filename = this.index.get(id);
    if (!filename) return null;
    // Placeholder: would read from file
    return null;
  }

  async loadAll(): Promise<Archetype[]> {
    // In a real implementation, this would read all files from the directory
    return [];
  }

  async delete(id: string): Promise<void> {
    this.index.delete(id);
  }

  async exists(id: string): Promise<boolean> {
    return this.index.has(id);
  }

  async search(query: string): Promise<Archetype[]> {
    // In a real implementation, this would search through files
    return [];
  }

  async update(archetype: Archetype): Promise<void> {
    if (!this.index.has(archetype.id)) {
      throw new Error(`Archetype not found: ${archetype.id}`);
    }
    // In a real implementation, this would update the file
  }
}

/**
 * Database storage implementation (for production)
 * Stores archetypes in a database with indexing
 */
export class DatabaseArchetypeStorage implements IArchetypeStorage {
  private connectionString: string;
  private tableName: string = 'archetypes';

  constructor(connectionString: string) {
    this.connectionString = connectionString;
  }

  async save(archetype: Archetype): Promise<void> {
    // In a real implementation, this would insert into database
    // Example: await db.query(`INSERT INTO ${this.tableName} VALUES (...)`)
  }

  async load(id: string): Promise<Archetype | null> {
    // In a real implementation, this would query the database
    // Example: const result = await db.query(`SELECT * FROM ${this.tableName} WHERE id = ?`, [id])
    return null;
  }

  async loadAll(): Promise<Archetype[]> {
    // In a real implementation, this would query all records
    // Example: const results = await db.query(`SELECT * FROM ${this.tableName}`)
    return [];
  }

  async delete(id: string): Promise<void> {
    // In a real implementation, this would delete from database
    // Example: await db.query(`DELETE FROM ${this.tableName} WHERE id = ?`, [id])
  }

  async exists(id: string): Promise<boolean> {
    // In a real implementation, this would check database
    // Example: const result = await db.query(`SELECT 1 FROM ${this.tableName} WHERE id = ?`, [id])
    return false;
  }

  async search(query: string): Promise<Archetype[]> {
    // In a real implementation, this would search database with full-text search
    // Example: const results = await db.query(`SELECT * FROM ${this.tableName} WHERE MATCH(...) AGAINST (?)`, [query])
    return [];
  }

  async update(archetype: Archetype): Promise<void> {
    // In a real implementation, this would update database record
    // Example: await db.query(`UPDATE ${this.tableName} SET ... WHERE id = ?`, [...])
  }
}

/**
 * Cached storage wrapper that adds caching layer on top of any storage backend
 */
export class CachedArchetypeStorage implements IArchetypeStorage {
  private backend: IArchetypeStorage;
  private cache: Map<string, Archetype> = new Map();
  private cacheExpiry: Map<string, number> = new Map();
  private cacheTTL: number; // Time to live in milliseconds

  constructor(backend: IArchetypeStorage, cacheTTL: number = 3600000) {
    // Default 1 hour
    this.backend = backend;
    this.cacheTTL = cacheTTL;
  }

  async save(archetype: Archetype): Promise<void> {
    await this.backend.save(archetype);
    this.cache.set(archetype.id, archetype);
    this.cacheExpiry.set(archetype.id, Date.now() + this.cacheTTL);
  }

  async load(id: string): Promise<Archetype | null> {
    // Check cache first
    if (this.isCacheValid(id)) {
      return this.cache.get(id) || null;
    }

    // Load from backend
    const archetype = await this.backend.load(id);
    if (archetype) {
      this.cache.set(id, archetype);
      this.cacheExpiry.set(id, Date.now() + this.cacheTTL);
    }
    return archetype;
  }

  async loadAll(): Promise<Archetype[]> {
    const archetypes = await this.backend.loadAll();
    for (const archetype of archetypes) {
      this.cache.set(archetype.id, archetype);
      this.cacheExpiry.set(archetype.id, Date.now() + this.cacheTTL);
    }
    return archetypes;
  }

  async delete(id: string): Promise<void> {
    await this.backend.delete(id);
    this.cache.delete(id);
    this.cacheExpiry.delete(id);
  }

  async exists(id: string): Promise<boolean> {
    if (this.isCacheValid(id)) {
      return this.cache.has(id);
    }
    return await this.backend.exists(id);
  }

  async search(query: string): Promise<Archetype[]> {
    // Search doesn't use cache (always fresh)
    return await this.backend.search(query);
  }

  async update(archetype: Archetype): Promise<void> {
    await this.backend.update(archetype);
    this.cache.set(archetype.id, archetype);
    this.cacheExpiry.set(archetype.id, Date.now() + this.cacheTTL);
  }

  /**
   * Clears the cache
   */
  clearCache(): void {
    this.cache.clear();
    this.cacheExpiry.clear();
  }

  /**
   * Gets cache statistics
   */
  getCacheStats(): {
    size: number;
    entries: string[];
  } {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys()),
    };
  }

  /**
   * Private: Checks if cache entry is still valid
   */
  private isCacheValid(id: string): boolean {
    const expiry = this.cacheExpiry.get(id);
    if (!expiry) return false;
    return Date.now() < expiry;
  }
}

/**
 * Storage factory for creating appropriate storage backend
 */
export class ArchetypeStorageFactory {
  static createInMemoryStorage(): IArchetypeStorage {
    return new InMemoryArchetypeStorage();
  }

  static createFileStorage(baseDir: string): IArchetypeStorage {
    return new FileArchetypeStorage(baseDir);
  }

  static createDatabaseStorage(connectionString: string): IArchetypeStorage {
    return new DatabaseArchetypeStorage(connectionString);
  }

  static createCachedStorage(
    backend: IArchetypeStorage,
    cacheTTL?: number
  ): IArchetypeStorage {
    return new CachedArchetypeStorage(backend, cacheTTL);
  }

  /**
   * Creates storage based on environment
   */
  static createFromEnvironment(): IArchetypeStorage {
    const storageType = process.env.ARCHETYPE_STORAGE_TYPE || 'memory';
    const cacheTTL = parseInt(
      process.env.ARCHETYPE_CACHE_TTL || '3600000',
      10
    );

    let backend: IArchetypeStorage;

    switch (storageType) {
      case 'file':
        const fileDir = process.env.ARCHETYPE_FILE_DIR || './data/archetypes';
        backend = this.createFileStorage(fileDir);
        break;

      case 'database':
        const dbConnection =
          process.env.ARCHETYPE_DB_CONNECTION ||
          'postgresql://localhost/archetypes';
        backend = this.createDatabaseStorage(dbConnection);
        break;

      case 'memory':
      default:
        backend = this.createInMemoryStorage();
        break;
    }

    // Wrap with caching if enabled
    const cacheEnabled =
      process.env.ARCHETYPE_CACHE_ENABLED !== 'false';
    if (cacheEnabled) {
      return this.createCachedStorage(backend, cacheTTL);
    }

    return backend;
  }
}

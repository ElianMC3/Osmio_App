/**
 * Acceso mínimo a IndexedDB para la capa offline.
 *
 * Sin dependencias: solo hacen falta object stores con clave `id`. La
 * transacción se resuelve en `oncomplete` (no en `onsuccess`), así una lectura
 * inmediatamente después de una escritura siempre ve lo escrito.
 */

const DB_NAME = 'osmio-offline'
const DB_VERSION = 2

/** Stores de la base local. Añadir uno nuevo requiere subir `DB_VERSION`. */
export type OfflineStore = 'session-outbox' | 'routines-cache'

const STORES: OfflineStore[] = ['session-outbox', 'routines-cache']

let dbPromise: Promise<IDBDatabase> | null = null

function openDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise

  dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = () => {
      const db = request.result
      for (const name of STORES) {
        if (!db.objectStoreNames.contains(name)) {
          db.createObjectStore(name, { keyPath: 'id' })
        }
      }
    }

    request.onsuccess = () => {
      const db = request.result
      // Otra pestaña quiere actualizar el esquema: cerramos para no bloquearla.
      db.onversionchange = () => {
        db.close()
        dbPromise = null
      }
      resolve(db)
    }

    request.onerror = () => {
      dbPromise = null
      reject(request.error ?? new Error('IndexedDB no está disponible'))
    }
  })

  return dbPromise
}

async function withStore<T>(
  storeName: OfflineStore,
  mode: IDBTransactionMode,
  run: (store: IDBObjectStore) => IDBRequest,
): Promise<T> {
  const db = await openDb()

  return new Promise<T>((resolve, reject) => {
    const tx = db.transaction(storeName, mode)
    let result: T

    const request = run(tx.objectStore(storeName))
    request.onsuccess = () => {
      result = request.result as T
    }

    tx.oncomplete = () => resolve(result)
    tx.onerror = () => reject(tx.error ?? new Error('La transacción de IndexedDB falló'))
    tx.onabort = () => reject(tx.error ?? new Error('La transacción de IndexedDB se abortó'))
  })
}

export function putEntry<T>(storeName: OfflineStore, entry: T): Promise<void> {
  return withStore<void>(storeName, 'readwrite', (store) => store.put(entry))
}

export function getEntry<T>(storeName: OfflineStore, id: string): Promise<T | undefined> {
  return withStore<T | undefined>(storeName, 'readonly', (store) => store.get(id))
}

export function getAllEntries<T>(storeName: OfflineStore): Promise<T[]> {
  return withStore<T[]>(storeName, 'readonly', (store) => store.getAll())
}

export function deleteEntry(storeName: OfflineStore, id: string): Promise<void> {
  return withStore<void>(storeName, 'readwrite', (store) => store.delete(id))
}

export function clearEntries(storeName: OfflineStore): Promise<void> {
  return withStore<void>(storeName, 'readwrite', (store) => store.clear())
}

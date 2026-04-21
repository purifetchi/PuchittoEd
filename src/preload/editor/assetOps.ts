/**
 * Represents an operation to create a new asset entry in the asset browser.
 */
export interface AssetCreate {
  type: 'create'
  name: string
}

/**
 * Represents an operation to delete a specific asset from the asset browser.
 */
export interface AssetDelete {
  type: 'delete'
  name: string
}

/**
 * Represents an operation to clear all currently loaded assets from the asset browser.
 */
export interface AssetClearAll {
  type: 'clearAll'
}

/**
 * Represents an operation to load multiple assets at once into the asset browser.
 */
export interface AssetBulkLoad {
  type: 'bulkLoad'
  names: string[]
}

/**
 * A union type representing all possible operations that can be performed
 * on the asset browser's loaded asset list.
 */
export type AssetOp = AssetCreate | AssetDelete | AssetClearAll | AssetBulkLoad

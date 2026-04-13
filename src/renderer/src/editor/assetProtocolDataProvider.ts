import type { DataProvider } from 'puchitto/data'

/**
 * The data provider that transforms paths into PuchittoEd paths.
 */
export class AssetProtocolDataProvider implements DataProvider {
  /**
   * Transforms this asset path into a PuchittoEd asset://.
   * @param assetPath The path to the asset.
   * @returns Always asset://assetPath
   */
  getUrl(assetPath: string): string | undefined {
    return `asset://${assetPath}`
  }

  /**
   * Disposes this data provider. Does nothing for this.
   */
  dispose(): void {
    // Ignored
  }
}

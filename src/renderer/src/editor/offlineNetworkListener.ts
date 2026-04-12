import type { NetworkListener, NetworkReader } from "puchitto/networking";

export class OfflineNetworkListener implements NetworkListener {
  onError?: (ev: Event) => Promise<unknown>;

  onData?: (nr: NetworkReader) => Promise<unknown>;

  onDisconnect?: (ev: Event) => Promise<unknown>;

  private _listening: boolean = false

  get listening(): boolean {
    return this._listening
  }

  listen() {
    this._listening = true
  }

  sendRaw(_: Uint8Array) {

  }
}

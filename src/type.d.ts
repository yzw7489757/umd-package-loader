interface Window {
  ASSETS_CACHE: Record<string, any>;
  requirejs: {
    (name: string[], callback: (e: any) => void, errorCb?: (err: any) => void): void
    config: {
      (c: { paths: Record<string, string> }): void
    }
  }
  require: Window['requirejs']
}


declare module "*.vue" {
  import Vue from 'vue'
  export default Vue
}
declare module "*.svelte" {
  import Svelte from 'svelte'
  export default Svelte
}

declare module "*.less" {
  const result: Record<string, any>
  export default result;
}
import { readResAsString, setCache, removeCache, getCache } from './utils/index';

interface LoaderProps {
  url: string, // 待约定 oss
  name: string;
  context?: globalThis.Window;
}

class BaseLoader {
  name: string;

  // context: globalThis.Window;

  url: string;

  options: LoaderProps;
  
  timestamp: number;

  noCache: boolean;

  contextWindow: Window;

  constructor(props: LoaderProps) {
    this.timestamp = +new Date() // 缓存时间戳
    this.contextWindow = props.context || window;
    if(!window.ASSETS_CACHE) {
      window.ASSETS_CACHE = Object.create(null);
    }
    // 缓存分为两级
    this.name = this.resolveName(props.name);
    this.url = this.resolveURL(props);
    this.options = { ...props }
  }

  /**
   * @private 根据协议标准，获取library
   */
  private resolveName = (name: string) => {
    return name.replace(/-([^-])/g, ($0, $1) => $1.toUpperCase());
  };

  /**
   * @private 根据协议标准，获取url
   */
  private resolveURL = (META: LoaderProps): string => {
    return this.shouldApplyLocalCache(META.url);
  };

  /**
   * @private
   * @param {string} url
   * @returns {string} 处理后的url
   */
  private shouldApplyLocalCache(url: string): string {
    const cacheParams = this.noCache ? `?s=${this.timestamp}` : '';
    return url + cacheParams
  }

  /**
   * @private 获取缓存
   */
  private getCache() {
    return getCache(this.name)
  }

  /**
   * @private 设置缓存
   */
  private setCache = (module: any, resolve?: (value: any) => void) => {
    setCache(this.name, module)
    if(typeof resolve === 'function') resolve(module)
  }

  /**
   * @public 清除本地缓存与文件缓存，使用timestamp的方式
   */
  public clearCache = () => {
    removeCache(this.name)
    this.timestamp = +new Date()
    this.url = this.resolveURL(this.options)
  }

  private createNode = (config: { scriptType?: string }, moduleName: string) => {
    var node = document.createElement('script')
    node.type = config.scriptType || 'text/javascript';
    node.charset = 'utf-8';
    node.async = true;
    node.setAttribute('data-name', this.name)
    return node;
  };

  /**
   * @public 加载微应用
   */
  public loadScript = (config: Record<string, any> = {}): Promise<any> => {
    const { name, contextWindow } = this;
    
    return new Promise((resolve, reject) => {
      if(this.getCache()) {
        return this.getCache();
      }
      console.time(`loadscript ${this.name}`);
      if (typeof window.requirejs === 'function') {
        // if webpack output `umdNamedDefine: true` must open & window.requirejs([moduleName])
        // window.requirejs.config({ 
        //   paths: { [name]: this.url.replace(/\.js$/, '') }
        // });
        
        window.requirejs(
          [this.url],
          (module: any) => { 
            this.setCache(module, resolve);
            console.timeEnd(`loadscript ${name}`);
          },
          (err) => reject(new Error(err)),
        );
      } else {
        const script = this.createNode(config, 'script',);
        script.addEventListener('load',  (e) => {
          if(e.type === 'load') {
            this.setCache(contextWindow[name], resolve)
            console.timeEnd(`loadscript ${name}`);
          }
        })
        script.addEventListener('error', function(err){
          reject(err)
        })
        script.src = this.url;
        document.head.appendChild(script);
      }
    })
  }

  // 未实现
  // loadScriptWithSandBox = () => {
    // fetch(this.url).then(res => readResAsString(res, false)).then<Window | void>((script) => {
    //   if(!window[__AGGREGATE_MAP_KEY][contextId]) {
    //     return reject(new Error(`${contextId} proxy window is non-existent`));
    //   }
    //   this.setCache(script);
    //   const target = `window.${__AGGREGATE_MAP_KEY}.${contextId}`;
    //   const sourceUrl = `//# sourceURL=${this.url}\n`;
    //   /* eslint-disable no-eval */
    //   eval(`
    //   ;(function(window, self, document, history){
    //     ;${script}\n;
    //     ${sourceUrl}
    //   }).bind(${target})(${target},${target},window.document,window.history);`)
    //   return new Promise<Window | never>((r) => {
    //     window.require([this.name], (res) => {
    //       window[__AGGREGATE_MAP_KEY][contextId][this.name] = res;
    //       r(window[__AGGREGATE_MAP_KEY][contextId])
    //     }, (err) => {
    //       reject(new Error(`loadscript Error: ${err}`))
    //     })
    //   })
    // })
  // }
}

export default BaseLoader;

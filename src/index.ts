import { readResAsString, setCache, removeCache, getCache, loadScriptTag, createIframe } from './utils/index';

interface LoaderProps {
  url: string, // 待约定 oss
  name: string;

  /**
   * @descrption 无缓存加载
   */
  noCache?: boolean;

  /**
   * @descrption 沙盒加载脚本
   */
  sandbox?: boolean;

  context?: globalThis.Window;
}

class BaseLoader {
  name: string;

  // context: globalThis.Window;

  url: string;

  options: LoaderProps;

  timestamp: number;

  sandbox = false

  contextWindow: Window;

  constructor(props: LoaderProps) {
    this.timestamp = +new Date() // 缓存时间戳
    this.contextWindow = props.context || window;
    if (!window.ASSETS_CACHE) {
      window.ASSETS_CACHE = Object.create(null);
    }
    // 缓存分为两级
    this.name = this.resolveName(props.name);
    this.url = this.resolveURL(props);
    this.options = props
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
    // 可以在这制定协议
    return this.shouldApplyLocalCache(META.url);
  };

  /**
   * @private
   * @param {string} url
   * @returns {string} 处理后的url
   */
  private shouldApplyLocalCache(url: string): string {
    const cacheParams = this.options.noCache ? `?s=${this.timestamp}` : '';
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
    if (typeof resolve === 'function') resolve(module)
  }

  /**
   * @public 清除本地缓存与文件缓存，使用timestamp的方式
   */
  private clearCache = () => {
    removeCache(this.name)
    this.timestamp = +new Date()
    this.url = this.resolveURL(this.options)
  }


  /**
   * @public 加载微应用
   */
  public loadScript = (config: Record<string, any> = {}): Promise<any> => {
    const { name, contextWindow } = this;

    if (this.options.noCache) {
      this.clearCache();
      return this.loadScriptWithNoCache();
    }

    if (this.getCache()) {
      return Promise.resolve(this.getCache());
    }

    return new Promise((resolve, reject) => {
      if (typeof window.requirejs === 'function') {
        // if webpack output `umdNamedDefine: true` must open & window.requirejs([moduleName])
        // window.requirejs.config({ 
        //   paths: { [name]: this.url.replace(/\.js$/, '') }
        // });
        console.time(`loadscript ${this.name}`);
        window.requirejs(
          [this.url],
          (module: any) => {
            this.setCache(module, resolve);
            console.timeEnd(`loadscript ${name}`);
          },
          (err) => reject(new Error(err)),
        );
      } else {
        loadScriptTag({
          name: this.name,
          url: this.url
        }).then(() => {
            this.setCache(contextWindow[name], resolve)
        })
      }
    })
  }


  private loadScriptWithNoCache(): Promise<any> {
    const { name, url } = this;
    return new Promise((resolve, reject) => {
      fetch(url).then(res => readResAsString(res, false)).then(script => {
        if (typeof window === 'object' && typeof document === 'object') {
        /* eslint-disable no-eval */
          eval(`
              ;(function(window, self){
                ;${script}\n;
                //# sourceURL=${url}\n
              }).bind(window, window)();
            `)
          this.setCache(window[name], resolve)
        } else if (typeof window === 'undefined' && typeof global === 'object') {
          // TODO: support Node??? 
        } else {
          reject(new Error('must run broswer or node envment'))
        }
      })
    })
  }

  // 未实现
  // loadScriptWithSandBox = (script: string) => {
  //     const win = createIframe();
  //     const target = `window.__AGGREGATE_MAP_KEY.sandBox`
  //     window[target] = win;

  //     return new Promise<Window | never>((rs, rj) => {
  //       /* eslint-disable no-eval */
  //       eval(`
  //         with(${target}){
  //           ;(function(window, self, document, history){
  //             ;${script}\n;
  //             //# sourceURL=${this.url}\n
  //           }).bind(${target})(${target},${target}, ${target}.document,${target}.history);
  //         }
  //       `)

  //       window.require([this.name], (res) => {
  //         window[target][this.name] = res;
  //         rs(window[target])
  //       }, (err) => {
  //         rj(new Error(`loadscript Error: ${err}`))
  //       })
  //     })
  // }
}

export default BaseLoader;

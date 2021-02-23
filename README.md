# intro

``` shell
tnpm i umd-package-loader --save
```

``` ts
import Loader from 'umd-package-loader';
const LazyLoadComponent = (): JSX.Element => {
  const [com, setCom] = React.useState(null)
  React.useEffect(() => {
    new Loader({
      url: 'https://xxx.js',
      name: 'xxx', // library name e.g. xxxCom
    }).loadScript().then(component => {
      const node = component.default;
      setCom(React.createElement(node))
    }).catch(err => {
      // dosomething
    })
  }, []);

  return com
}
```
 
support requirejs，When the page has requirejs, it will be loaded in the way of define + require。if not, will use `document.createElement('script')` load script.

be careful, must follow `commonjs` or `amd` standard, forever, `umd` better. e.g. webpack 

``` js
module.exports = {
  devtool: 'source-map',
  entry: {
    reactDemo: resolve(__dirname, '../appGrounds/react/index.tsx')
  },
  output: {
    library: "xxx", // moduleName, the loader prop
    libraryTarget: 'umd', // must
    filename: '[name].js',
    path: resolve(__dirname, '../entry/lib'),
  }
}
```

## 版本协议

MIT

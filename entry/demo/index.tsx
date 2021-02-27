import React, { useEffect, useState } from 'react'
import Loader from '../../src/index';

export default (): JSX.Element => {
  const [com, setCom] = React.useState(null)
  const instance = React.useRef<Loader>(null);

  useEffect(() => {
    instance.current = new Loader({
      url: 'http://127.0.0.1:5500/entry/lib/reactDemo.js',
      name: 'reactFooter',
      noCache: false
    })

    instance.current.loadScript().then(component => {
      const node = component.default;
      setCom(React.createElement(node))
    })
  }, []);
  
  const reload = React.useCallback(() => {
    instance.current.loadScript().then(component => {
      const node = component.default;
      setCom(React.createElement(node))
    })
  }, [])

  return <div>
    <button onClick={reload} type="button">Reload</button>
    {com}
  </div>
}
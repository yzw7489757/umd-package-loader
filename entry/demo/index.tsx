import React, { useEffect, useState } from 'react'
import Loader from '../../src/index';

export default (): JSX.Element => {
  const [com, setCom] = React.useState(null)
  useEffect(() => {
    new Loader({
      url: 'https://0.0.0.0:8400/lib/reactDemo.js',
      name: 'reactFooter',
    }).loadScript().then(component => {
      const node = component.default;
      setCom(React.createElement(node))
    })
  }, []);

  return com
}
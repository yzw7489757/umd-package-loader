import React, { useEffect, useState } from 'react'
import Loader from '../../src/index';

export default (): JSX.Element => {
  const [com, setCom] = React.useState(null)
  useEffect(() => {
    new Loader({
      url: 'https://dev.g.alicdn.com/xspace/component-voice-to-text/0.1.0/index.js',
      name: 'reactFooter',
    }).loadScript().then(component => {
      const node = component.default;
      setCom(React.createElement(node))
    })
  }, []);

  return com
}
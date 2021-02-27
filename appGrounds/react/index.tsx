import React, { useEffect } from 'react';
import { createStore } from 'redux';
import ReactDOM from 'react-dom';
import styles from './index.module.less';

const defaultState = {
    time: ""
}
const reducer = (state = defaultState, action) => {
    switch (action.type) {
      case 'CHANGE_TIME': {
        return {
          ...state, 
          time: action.payload
        }
      }
        default: return state
    }
}

const store = createStore(reducer)

const Footer = () => {
  const [time, setTime]= React.useState(+new Date())
  useEffect(() => {
    (window as any).a = 1111;
    store.subscribe(() => {
      setTime(store.getState().time)
    })
  }, [])
  return ( 
    <div className={styles.reactWrapper}>
      <h2>React App</h2>
      <h3>Now is {time}</h3>
    </div>
  )
};

export default Footer;

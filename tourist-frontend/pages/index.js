import Head from 'next/head'
import styles from '../styles/Home.module.css'
import config from '../config/config'


export default function Home() {
  return (
    <div className={styles.container}>
      <h1> Hello World </h1>
      <br/>
      Local address : {config.URL.LOCAL}
      <br/>
      Server address : {config.URL.SERVER}
      <br/>
    </div>
  )
}

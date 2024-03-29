import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import Banner from '@/components/banner'
import Card from '@/components/card'
import coffeeStoresData from '../data/coffee-stores.json'
import { fetchCoffeeStores } from '@/lib/coffee-stores'
import useTrackLocation from '@/hooks/use-track-location'
import { useEffect, useState, useContext } from 'react'
import { ACTION_TYPES, StoreContext } from "@/store/store-context"

const inter = Inter({ subsets: ['latin'] })

export async function getStaticProps(context) {
  const coffeeStores = await fetchCoffeeStores()

  return {
    props: {
      coffeeStores,
    }, // will be passed to the page component as props
  }
}


export default function Home(props) {
  // const [coffeeStores, setCoffeeStores] = useState('')
  const [coffeeStoresError, setCoffeeStoresError] = useState(null)

  const { dispatch, state } = useContext(StoreContext)
  const { coffeeStores, latLong } = state

  const { handleTrackLocation, locationErrorMsg, isFindingLocation } = useTrackLocation()

  useEffect(() => {
    async function setCoffeeStoresByLocation() {
      if(latLong) {
        try {
          const fetchedCoffeeStoresResponse = await fetch(`/api/getCoffeeStoresByLocation?latLong=${latLong}&limit=12`)
          const fetchedCoffeeStores = await fetchedCoffeeStoresResponse.json()
          // setCoffeeStores(fetchedCoffeeStores)
          dispatch({
            type: ACTION_TYPES.SET_COFFEE_STORES,
            payload: {
              coffeeStores: fetchedCoffeeStores,
            }
          })
          setCoffeeStoresError('')
        } catch (error) {
          setCoffeeStoresError(error.message)
        }
      }
    }

    setCoffeeStoresByLocation()
  }, [latLong, dispatch])

  const handleOnBannerBtnClick = () => {
    handleTrackLocation()
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connoisseur</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Discover coffee stores."></meta>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Banner buttonText={isFindingLocation ? "Locating..." : "View stores nearby"} handleOnClick={handleOnBannerBtnClick} />
        {locationErrorMsg && <p>Something went wrong: {locationErrorMsg}</p>}
        {coffeeStoresError && <p>Something went wrong: {coffeeStoresError}</p>}
        <div className={styles.heroImage}>
          <Image src="/static/hero-image.png" alt="" width={700} height={400} priority={true} />
        </div>

        {coffeeStores.length > 0 && (
          <>
            <h2 className={styles.heading2}>Coffee shops near me</h2>
            <div className={styles.cardLayout}>
              {coffeeStores.map(coffeeStore => {
                return (
                  <Card 
                    name={coffeeStore.name} 
                    imgUrl={coffeeStore.imgUrl || 'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'} 
                    href={`/coffee-store/${coffeeStore.id}`} 
                    className={styles.cardLayout} 
                    key={coffeeStore.id}
                  />
                )
              })}
            </div>
          </>
        )}

        {props.coffeeStores.length > 0 && (
          <>
            <h2 className={styles.heading2}>Tampere coffee shops</h2>
            <div className={styles.cardLayout}>
              {props.coffeeStores.map(coffeeStore => {
                return (
                  <Card 
                    name={coffeeStore.name} 
                    imgUrl={coffeeStore.imgUrl || 'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'} 
                    href={`/coffee-store/${coffeeStore.id}`} 
                    className={styles.cardLayout} 
                    key={coffeeStore.id}
                  />
                )
              })}
            </div>
          </>
        )}

      </main>
    </div>
  )
}

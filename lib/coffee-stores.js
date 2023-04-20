import { createApi } from 'unsplash-js'

const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
})

const getUrlForCoffeeStores = (latlong, query, limit) => {
  return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latlong}&limit=${limit}`
}

const getListOfCoffeeStorePhotos = async () => {
  const photos = await unsplash.search.getPhotos({
    query: 'coffee shop',
    page: 1,
    perPage: 40,
    orientation: 'landscape',
  })

  const unsplashResults = photos.response.results
  
  return unsplashResults.map((result) => result.urls['small'])
}

export const fetchCoffeeStores = async (latLong = '61.50085567410766,23.759693402824876', limit = 6) => {

  const photos = await getListOfCoffeeStorePhotos()

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY,
    }
  };
  
  const response = await fetch(
    getUrlForCoffeeStores(
      latLong, 
      'coffee',
      limit,
    ), 
    options)

  const data = await response.json()
  return data.results.map((results, index) => {
    return {
      id: results.fsq_id,
      name: results.name,
      address: results.location.address,
      imgUrl: photos.length > 0 ? photos[index] : null,
    }
  })
  //.catch(err => console.error(err));
}
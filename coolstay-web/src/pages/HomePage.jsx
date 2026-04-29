import { useState, useEffect } from 'react'
import api from '../api/axios'
import PropertyCard from '../components/PropertyCard'

export default function HomePage() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [city, setCity] = useState('')
  const [guests, setGuests] = useState('')

  const fetchProperties = async () => {
    setLoading(true)
    try {
      const params = {}
      if (city) params.city = city
      if (guests) params.guests = guests
      const { data } = await api.get('/properties', { params })
      setProperties(data)
    } catch {
      setProperties([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProperties() }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchProperties()
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-r from-rose-500 to-pink-500 py-16 px-6 text-white text-center">
        <h1 className="text-4xl font-bold mb-2">Find your perfect stay</h1>
        <p className="text-rose-100 mb-8">Discover unique places to stay around the world</p>

        <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex gap-2 bg-white rounded-full p-2 shadow-lg">
          <input
            type="text"
            placeholder="Where are you going?"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="flex-1 px-4 py-2 text-gray-800 outline-none rounded-full"
          />
          <input
            type="number"
            placeholder="Guests"
            min="1"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="w-24 px-4 py-2 text-gray-800 outline-none rounded-full"
          />
          <button type="submit" className="bg-rose-500 text-white px-6 py-2 rounded-full hover:bg-rose-600 transition font-medium">
            Search
          </button>
        </form>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">
          {loading ? 'Loading...' : `${properties.length} places to stay`}
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-xl" />
                <div className="mt-2 h-4 bg-gray-200 rounded w-3/4" />
                <div className="mt-1 h-3 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <p className="text-gray-500 text-center py-16">No properties found. Try a different search.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {properties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

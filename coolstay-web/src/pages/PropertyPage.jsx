import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80'

export default function PropertyPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [property, setProperty] = useState(null)
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    api.get(`/properties/${id}`)
      .then(({ data }) => setProperty(data))
      .finally(() => setLoading(false))
  }, [id])

  const nights = checkIn && checkOut
    ? Math.max(0, Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000))
    : 0

  const handleBook = async (e) => {
    e.preventDefault()
    if (!user) { navigate('/login'); return }
    setBooking(true)
    setError('')
    try {
      await api.post('/bookings', { propertyId: id, checkIn, checkOut })
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.error || 'Booking failed.')
    } finally {
      setBooking(false)
    }
  }

  if (loading) return <div className="p-10 text-center text-gray-500">Loading...</div>
  if (!property) return <div className="p-10 text-center text-gray-500">Property not found.</div>

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
      <p className="text-gray-500 mb-6">{property.address}, {property.city}, {property.country}</p>

      <div className="rounded-2xl overflow-hidden mb-8 aspect-video bg-gray-100">
        <img
          src={property.imageUrl || PLACEHOLDER}
          alt={property.title}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = PLACEHOLDER }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-200">
            <div><span className="text-2xl font-bold">{property.bedrooms}</span> <span className="text-gray-500">bedrooms</span></div>
            <div><span className="text-2xl font-bold">{property.bathrooms}</span> <span className="text-gray-500">bathrooms</span></div>
            <div><span className="text-2xl font-bold">{property.maxGuests}</span> <span className="text-gray-500">guests max</span></div>
          </div>

          <div className="mb-6 pb-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold mb-2">Hosted by {property.hostName}</h2>
            <p className="text-gray-600 leading-relaxed">{property.description}</p>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="border border-gray-200 rounded-2xl p-6 shadow-md sticky top-24">
            <p className="text-xl font-bold mb-4">
              ${property.pricePerNight} <span className="text-gray-500 font-normal text-base">/ night</span>
            </p>

            {success ? (
              <div className="text-center">
                <p className="text-green-600 font-semibold mb-3">Booking confirmed!</p>
                <button onClick={() => navigate('/bookings')} className="w-full bg-rose-500 text-white py-3 rounded-xl hover:bg-rose-600">
                  View my bookings
                </button>
              </div>
            ) : (
              <form onSubmit={handleBook} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Check-in</label>
                  <input
                    type="date"
                    required
                    value={checkIn}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-rose-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Check-out</label>
                  <input
                    type="date"
                    required
                    value={checkOut}
                    min={checkIn || new Date().toISOString().split('T')[0]}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-rose-500"
                  />
                </div>

                {nights > 0 && (
                  <div className="border-t border-gray-200 pt-3 flex justify-between text-sm">
                    <span>${property.pricePerNight} × {nights} nights</span>
                    <span className="font-bold">${property.pricePerNight * nights}</span>
                  </div>
                )}

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button
                  type="submit"
                  disabled={booking}
                  className="w-full bg-rose-500 text-white py-3 rounded-xl hover:bg-rose-600 font-semibold disabled:opacity-60"
                >
                  {booking ? 'Booking...' : 'Reserve'}
                </button>

                {!user && <p className="text-xs text-gray-500 text-center">You need to log in to reserve.</p>}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

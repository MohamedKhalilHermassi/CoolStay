import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=300&q=80'

export default function BookingsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    api.get('/bookings').then(({ data }) => setBookings(data)).finally(() => setLoading(false))
  }, [user, navigate])

  const handleCancel = async (id) => {
    if (!confirm('Cancel this booking?')) return
    try {
      await api.delete(`/bookings/${id}`)
      setBookings(bookings.map(b => b.id === id ? { ...b, status: 'cancelled' } : b))
    } catch (err) {
      alert(err.response?.data?.error || 'Could not cancel.')
    }
  }

  if (loading) return <div className="p-10 text-center text-gray-500">Loading...</div>

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {user?.role === 'host' ? 'Bookings for my listings' : 'My bookings'}
      </h1>

      {bookings.length === 0 ? (
        <p className="text-gray-500">No bookings yet.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b.id} className="flex gap-4 border border-gray-200 rounded-2xl p-4 bg-white">
              <img
                src={b.propertyImageUrl || PLACEHOLDER}
                alt={b.propertyTitle}
                onError={(e) => { e.target.src = PLACEHOLDER }}
                className="w-24 h-24 object-cover rounded-xl flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{b.propertyTitle}</h3>
                <p className="text-gray-500 text-sm">{b.propertyCity}</p>
                <p className="text-sm mt-1">
                  {new Date(b.checkIn).toLocaleDateString()} → {new Date(b.checkOut).toLocaleDateString()}
                </p>
                {user?.role === 'host' && (
                  <p className="text-sm text-gray-500">Guest: {b.guestName}</p>
                )}
                <p className="font-semibold mt-1">${b.totalPrice}</p>
              </div>
              <div className="flex flex-col items-end justify-between">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  b.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                }`}>
                  {b.status}
                </span>
                {b.status === 'confirmed' && user?.role === 'guest' && (
                  <button
                    onClick={() => handleCancel(b.id)}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

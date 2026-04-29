import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=300&q=80'

export default function HostListingsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || user.role !== 'host') { navigate('/'); return }
    api.get('/properties/my').then(({ data }) => setListings(data)).finally(() => setLoading(false))
  }, [user, navigate])

  const handleDelete = async (id) => {
    if (!confirm('Delete this listing?')) return
    try {
      await api.delete(`/properties/${id}`)
      setListings(listings.filter(l => l.id !== id))
    } catch (err) {
      alert(err.response?.data?.error || 'Could not delete.')
    }
  }

  if (loading) return <div className="p-10 text-center text-gray-500">Loading...</div>

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Listings</h1>
        <Link to="/host/listings/new" className="bg-rose-500 text-white px-4 py-2 rounded-full hover:bg-rose-600 text-sm font-medium">
          + Add listing
        </Link>
      </div>

      {listings.length === 0 ? (
        <p className="text-gray-500">You have no listings yet.</p>
      ) : (
        <div className="space-y-4">
          {listings.map((l) => (
            <div key={l.id} className="flex gap-4 border border-gray-200 rounded-2xl p-4 bg-white">
              <img
                src={l.imageUrl || PLACEHOLDER}
                alt={l.title}
                onError={(e) => { e.target.src = PLACEHOLDER }}
                className="w-24 h-24 object-cover rounded-xl flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900">{l.title}</h3>
                <p className="text-gray-500 text-sm">{l.city}, {l.country}</p>
                <p className="text-sm mt-1"><span className="font-semibold">${l.pricePerNight}</span> / night</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`text-xs px-2 py-1 rounded-full ${l.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {l.isActive ? 'Active' : 'Inactive'}
                </span>
                <Link to={`/host/listings/${l.id}/edit`} className="text-xs text-rose-500 hover:underline">Edit</Link>
                <button onClick={() => handleDelete(l.id)} className="text-xs text-red-500 hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

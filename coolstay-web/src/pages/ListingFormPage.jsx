import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

const INITIAL = {
  title: '', description: '', address: '', city: '', country: '',
  pricePerNight: '', maxGuests: '', bedrooms: '', bathrooms: '', imageUrl: ''
}

export default function ListingFormPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)

  const [form, setForm] = useState(INITIAL)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user || user.role !== 'host') { navigate('/'); return }
    if (isEdit) {
      api.get(`/properties/${id}`).then(({ data }) => setForm({
        title: data.title, description: data.description, address: data.address,
        city: data.city, country: data.country, pricePerNight: data.pricePerNight,
        maxGuests: data.maxGuests, bedrooms: data.bedrooms, bathrooms: data.bathrooms,
        imageUrl: data.imageUrl
      }))
    }
  }, [user, navigate, id, isEdit])

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const payload = {
        ...form,
        pricePerNight: parseFloat(form.pricePerNight),
        maxGuests: parseInt(form.maxGuests),
        bedrooms: parseInt(form.bedrooms),
        bathrooms: parseInt(form.bathrooms),
      }
      if (isEdit) {
        await api.put(`/properties/${id}`, payload)
      } else {
        await api.post('/properties', payload)
      }
      navigate('/host/listings')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save listing.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{isEdit ? 'Edit listing' : 'Add new listing'}</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white border border-gray-200 rounded-2xl p-6">
        {[
          { key: 'title', label: 'Title', type: 'text', required: true },
          { key: 'address', label: 'Address', type: 'text', required: true },
          { key: 'city', label: 'City', type: 'text', required: true },
          { key: 'country', label: 'Country', type: 'text', required: true },
          { key: 'imageUrl', label: 'Image URL', type: 'url', required: false },
        ].map(({ key, label, type, required }) => (
          <div key={key}>
            <label className="text-sm font-medium text-gray-700">{label}</label>
            <input
              type={type}
              required={required}
              value={form[key]}
              onChange={set(key)}
              className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-rose-500"
            />
          </div>
        ))}

        <div>
          <label className="text-sm font-medium text-gray-700">Description</label>
          <textarea
            required
            rows={3}
            value={form.description}
            onChange={set('description')}
            className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-rose-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { key: 'pricePerNight', label: 'Price / night ($)' },
            { key: 'maxGuests', label: 'Max guests' },
            { key: 'bedrooms', label: 'Bedrooms' },
            { key: 'bathrooms', label: 'Bathrooms' },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="text-sm font-medium text-gray-700">{label}</label>
              <input
                type="number"
                required
                min="1"
                value={form[key]}
                onChange={set(key)}
                className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-rose-500"
              />
            </div>
          ))}
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-rose-500 text-white py-2.5 rounded-lg hover:bg-rose-600 font-medium disabled:opacity-60"
          >
            {loading ? 'Saving...' : isEdit ? 'Save changes' : 'Publish listing'}
          </button>
          <button type="button" onClick={() => navigate('/host/listings')} className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

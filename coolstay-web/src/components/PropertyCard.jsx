import { Link } from 'react-router-dom'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80'

export default function PropertyCard({ property }) {
  return (
    <Link to={`/properties/${property.id}`} className="group block">
      <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
        <img
          src={property.imageUrl || PLACEHOLDER}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.target.src = PLACEHOLDER }}
        />
      </div>
      <div className="mt-2">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-gray-900 truncate">{property.city}, {property.country}</h3>
        </div>
        <p className="text-gray-500 text-sm truncate">{property.title}</p>
        <p className="mt-1">
          <span className="font-semibold">${property.pricePerNight}</span>
          <span className="text-gray-500 text-sm"> / night</span>
        </p>
      </div>
    </Link>
  )
}

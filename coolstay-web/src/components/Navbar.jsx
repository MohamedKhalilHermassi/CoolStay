import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      <Link to="/" className="text-rose-500 font-bold text-2xl tracking-tight">
        coolstay
      </Link>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm text-gray-600">Hi, {user.firstName}</span>
            {user.role === 'host' && (
              <>
                <Link to="/host/listings" className="text-sm text-gray-700 hover:text-rose-500">My Listings</Link>
                <Link to="/host/listings/new" className="text-sm bg-rose-500 text-white px-3 py-1.5 rounded-full hover:bg-rose-600">
                  + Add Listing
                </Link>
              </>
            )}
            <Link to="/bookings" className="text-sm text-gray-700 hover:text-rose-500">Bookings</Link>
            <button onClick={handleLogout} className="text-sm text-gray-700 hover:text-rose-500">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm text-gray-700 hover:text-rose-500">Login</Link>
            <Link to="/register" className="text-sm bg-rose-500 text-white px-4 py-2 rounded-full hover:bg-rose-600">
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

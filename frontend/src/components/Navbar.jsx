import React, { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  ShoppingCart,
  Menu,
  X,
  LogOut,
  User,
  LayoutDashboard,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '@/redux/userSlice'

function Navbar() {
  const { user } = useSelector((state) => state.user)
  const { cart } = useSelector((state) => state.product)

  const admin = user?.role === 'admin'
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [menuOpen, setMenuOpen] = useState(false)

  const accessToken = localStorage.getItem('accessToken')

  const cartCount =
    cart?.items?.reduce(
      (total, item) => total + item.quantity,
      0
    ) || 0

  const logoutHandler = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_URL}/api/v1/user/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )

      if (res.data.success) {
        dispatch(setUser(null))

        localStorage.removeItem('user')
        localStorage.removeItem('accessToken')

        toast.success(res.data.message)
        navigate('/login')
      }
    } catch (error) {
      console.log(error)
      toast.error('Logout failed')
    }
  }

  const handleLoginClick = () => {
    navigate('/login')
    setMenuOpen(false)
  }

  const desktopLinkClass = ({ isActive }) =>
    `relative text-sm font-medium transition-colors group ${
      isActive ? 'text-cyan-400' : 'text-gray-300 hover:text-cyan-400'
    }`

  const underlineClass = (isActive) =>
    `absolute -bottom-2 left-0 h-[2px] bg-cyan-400 transition-all duration-300 ${
      isActive ? 'w-full' : 'w-0 group-hover:w-full'
    }`

  const mobileLinkClass = ({ isActive }) =>
    `font-medium transition-colors ${
      isActive ? 'text-cyan-400' : 'text-white hover:text-cyan-400'
    }`

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#071426]/95 backdrop-blur-xl border-b border-cyan-400/10 shadow-[0_4px_30px_rgba(0,0,0,0.35)]">
        <nav className="max-w-7xl mx-auto px-5 md:px-8 py-5">

          <div className="flex items-center justify-between">

            <Link to="/" className="group flex items-center gap-2">
              <div className="w-19 h-11 rounded-lg flex items-center justify-center shadow-[0_0_25px_rgba(34,211,238,0.25)]">
                <img src='/logo.png ' alt='main-logo' className='h-11'/>
              </div>

              <div>
                <h1 className="text-2xl md:text-4xl font-black tracking-tight text-cyan-400">
                  e<span className="text-white">Kart</span>
                </h1>

                <p className="hidden sm:block text-[9px] uppercase tracking-[0.25em] text-gray-400">
                  Instant Commerce
                </p>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-8">

              <NavLink to="/" end className={desktopLinkClass}>
                {({ isActive }) => (
                  <>
                    Home
                    <span className={underlineClass(isActive)} />
                  </>
                )}
              </NavLink>

              <NavLink to="/products" className={desktopLinkClass}>
                {({ isActive }) => (
                  <>
                    Products
                    <span className={underlineClass(isActive)} />
                  </>
                )}
              </NavLink>

              {user && (
                <NavLink to="/profile" className={desktopLinkClass}>
                  {({ isActive }) => (
                    <>
                      <span className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Hello {user.firstName}
                      </span>
                      <span className={underlineClass(isActive)} />
                    </>
                  )}
                </NavLink>
              )}

              {admin && (
                <NavLink to="/dashboard/sales" className={desktopLinkClass}>
                  {({ isActive }) => (
                    <>
                      <span className="flex items-center gap-2">
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </span>
                      <span className={underlineClass(isActive)} />
                    </>
                  )}
                </NavLink>
              )}

              <NavLink to="/cart" className="relative group p-2">
                {({ isActive }) => (
                  <>
                    <ShoppingCart
                      className={`w-5 h-5 transition-colors ${
                        isActive ? 'text-cyan-400' : 'text-white group-hover:text-cyan-400'
                      }`}
                    />

                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-2 min-w-[20px] h-5 px-1 rounded-full bg-cyan-400 text-black text-[11px] font-bold flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}

                    <span
                      className={`absolute bottom-0 left-0 right-0 h-[2px] bg-cyan-400 transition-all duration-300 ${
                        isActive ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}
                    />
                  </>
                )}
              </NavLink>

              {user ? (
                <Button
                  onClick={logoutHandler}
                  className="h-10 px-5 rounded-lg bg-transparent border border-white/30 text-white hover:bg-white hover:text-black transition-all"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              ) : (
                <Button
                  onClick={handleLoginClick}
                  className="h-10 px-6 rounded-lg bg-cyan-400 text-black font-bold hover:bg-cyan-300 transition-all shadow-[0_0_20px_rgba(34,211,238,0.15)]"
                >
                  Login
                </Button>
              )}
            </div>

            <div className="lg:hidden flex items-center gap-4">

              <NavLink to="/cart" className="relative p-2">
                {({ isActive }) => (
                  <>
                    <ShoppingCart
                      className={`w-6 h-6 transition-colors ${
                        isActive ? 'text-cyan-400' : 'text-white'
                      }`}
                    />

                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-[19px] h-[19px] px-1 rounded-full bg-cyan-400 text-black text-[10px] font-bold flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </>
                )}
              </NavLink>

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 text-white hover:text-cyan-400 transition-colors"
              >
                {menuOpen ? (
                  <X className="w-7 h-7" />
                ) : (
                  <Menu className="w-7 h-7" />
                )}
              </button>

            </div>

          </div>

          {menuOpen && (
            <div className="lg:hidden mt-5 rounded-2xl border border-white/10 bg-black/90 backdrop-blur-xl p-5 shadow-2xl">

              <div className="flex flex-col gap-5">

                <NavLink to="/" end onClick={() => setMenuOpen(false)} className={mobileLinkClass}>
                  Home
                </NavLink>

                <NavLink to="/products" onClick={() => setMenuOpen(false)} className={mobileLinkClass}>
                  Products
                </NavLink>

                {user && (
                  <NavLink to="/profile" onClick={() => setMenuOpen(false)} className={mobileLinkClass}>
                    <span className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Hello {user.firstName}
                    </span>
                  </NavLink>
                )}

                {admin && (
                  <NavLink to="/dashboard/sales" onClick={() => setMenuOpen(false)} className={mobileLinkClass}>
                    <span className="flex items-center gap-2">
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </span>
                  </NavLink>
                )}

                <NavLink to="/cart" onClick={() => setMenuOpen(false)} className={mobileLinkClass}>
                  <span className="flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    Cart
                  </span>
                </NavLink>

                <div className="h-px bg-white/10" />

                {user ? (
                  <Button
                    onClick={logoutHandler}
                    className="w-full h-11 bg-white text-black hover:bg-gray-200"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                ) : (
                  <Button
                    onClick={handleLoginClick}
                    className="w-full h-11 bg-cyan-400 text-black font-bold hover:bg-cyan-300"
                  >
                    Login
                  </Button>
                )}

              </div>
            </div>
          )}

        </nav>
      </header>

      <div className="h-20 md:h-24 bg-black" aria-hidden="true" />
    </>
  )
}

export default Navbar
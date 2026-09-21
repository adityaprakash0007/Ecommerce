import { NavLink } from 'react-router-dom'
import { LayoutDashboard, PackagePlus, PackageSearch, Users } from 'lucide-react'
import { FaRegEdit } from 'react-icons/fa'

const Sidebar = () => {
  const navItems = [
    { to: '/dashboard/sales', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/dashboard/add-product', icon: PackagePlus, label: 'Add Product' },
    { to: '/dashboard/products', icon: PackageSearch, label: 'Products' },
    { to: '/dashboard/users', icon: Users, label: 'Users' },
    { to: '/dashboard/orders', icon: FaRegEdit, label: 'Orders' },
  ]

  return (
    <div className="hidden fixed md:block z-30 w-[300px] h-screen bg-[#071426] border-r border-white/10 p-6">

      <div className="relative mb-8 px-2">

        <h1 className="text-2xl font-black text-white tracking-tight">
          Admin<span className="text-cyan-400">Panel</span>
        </h1>

        <p className="text-[10px] uppercase tracking-[0.18em] text-cyan-400 font-semibold mt-1">
          Control Center
        </p>

        <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-cyan-400/10 blur-[70px] pointer-events-none" />

      </div>

      <nav className="flex flex-col gap-2">

        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 overflow-hidden ${
                isActive
                  ? 'bg-cyan-400 text-black shadow-[0_0_25px_rgba(34,211,238,0.25)]'
                  : 'text-gray-300 hover:bg-white/5 hover:text-cyan-300 hover:border-cyan-400/40 border border-transparent'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {!isActive && (
                  <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}

                <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />

                <span>{label}</span>

                {isActive && (
                  <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-black/40" />
                )}
              </>
            )}
          </NavLink>
        ))}

      </nav>

      <div className="mt-10 h-px w-full bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />

      <div className="mt-6 px-2">

        <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">
          Logged in as
        </p>

        <p className="text-sm font-semibold text-white">
          Admin
        </p>

      </div>

    </div>
  )
}

export default Sidebar
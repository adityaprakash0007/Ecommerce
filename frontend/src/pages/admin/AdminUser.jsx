import axios from 'axios'
import { Edit, Eye, Search } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import UserLogo from '../../assets/user.jpg'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  const navigate = useNavigate()

  const getAllUsers = async () => {
    const accessToken = localStorage.getItem("accessToken")

    try {
      const res = await axios.get(
        'http://localhost:8000/api/v1/user/all-user',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      )

      if (res.data.success) {
        setUsers(res.data.users)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getAllUsers()
  }, [])

  const filteredUsers = users.filter((user) => {
    const search = searchTerm.toLowerCase()

    return (
      user?.firstName?.toLowerCase().includes(search) ||
      user?.lastName?.toLowerCase().includes(search) ||
      user?.email?.toLowerCase().includes(search)
    )
  })

  return (
    <div className="relative min-h-screen bg-[#050b14] text-white pl-[350px] py-10 pr-20">

      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-cyan-400/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 -right-40 w-[350px] h-[350px] rounded-full bg-cyan-500/5 blur-[100px] pointer-events-none" />

      <div className="relative z-10">

        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
          User <span className="text-cyan-400">Management</span>
        </h1>

        <p className="text-[10px] uppercase tracking-[0.18em] text-gray-500 font-semibold mt-2">
          View and manage registered users
        </p>

        <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />

        <div className="relative w-[320px] mt-8">

          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 pointer-events-none z-10" />

          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-11 bg-[#071426] border border-white/10 text-white placeholder:text-gray-500 rounded-xl outline-none focus:ring-1 focus:ring-cyan-400/50 focus:border-cyan-400/40 transition-all"
            placeholder="Search users..."
          />

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 mt-8">

          {filteredUsers.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <p className="text-gray-400 text-lg">No users found</p>
              <p className="text-gray-600 text-sm mt-2">Try a different search term.</p>
            </div>
          ) : (
            filteredUsers.map((user, index) => (
              <div
                key={index}
                className="group relative overflow-hidden bg-[#071426] border border-white/10 rounded-2xl p-5 transition-all duration-500 hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-[0_20px_50px_rgba(34,211,238,0.10)]"
              >

                <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-cyan-400/5 blur-3xl pointer-events-none transition-all duration-500 group-hover:bg-cyan-400/10" />

                <div className="relative flex items-center gap-3">

                  <img
                    src={user?.profilePic || UserLogo}
                    alt=""
                    className="rounded-full w-16 aspect-square object-cover border-2 border-cyan-400/40 shadow-[0_0_20px_rgba(34,211,238,0.15)]"
                  />

                  <div className="min-w-0 flex-1">

                    <h1 className="font-bold text-white truncate">
                      {user?.firstName} {user?.lastName}
                    </h1>

                    <h3 className="text-xs text-gray-400 truncate mt-0.5">
                      {user?.email}
                    </h3>

                    {user?.role && (
                      <span className={`inline-block mt-1.5 text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${
                        user.role === 'admin'
                          ? 'bg-cyan-400/15 text-cyan-300 border border-cyan-400/30'
                          : 'bg-white/5 text-gray-400 border border-white/10'
                      }`}>
                        {user.role}
                      </span>
                    )}

                  </div>

                </div>

                <div className="relative flex gap-2 mt-5">

                  <Button
                    onClick={() =>
                      navigate(`/dashboard/users/${user?._id}`, {
                        state: { user }
                      })
                    }
                    className="flex-1 h-10 rounded-xl bg-cyan-400 text-black font-semibold hover:bg-cyan-300 hover:scale-[1.02] transition-all duration-300 shadow-[0_0_20px_rgba(34,211,238,0.12)]"
                  >
                    <Edit className="w-4 h-4 mr-1.5" />
                    Edit
                  </Button>

                  <Button
                    onClick={() =>
                      navigate(`/dashboard/users/orders/${user?._id}`)
                    }
                    className="flex-1 h-10 rounded-xl bg-transparent border border-white/15 text-white hover:bg-white hover:text-black transition-all duration-300"
                  >
                    <Eye className="w-4 h-4 mr-1.5" />
                    Orders
                  </Button>

                </div>

                <div className="mt-4 h-[2px] w-0 bg-cyan-400 transition-all duration-500 group-hover:w-10" />

              </div>
            ))
          )}

        </div>

      </div>

    </div>
  )
}

export default AdminUsers
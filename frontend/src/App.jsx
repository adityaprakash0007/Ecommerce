import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setUser } from '@/redux/userSlice'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { setCart } from '@/redux/productSlice'
import axios from 'axios'
import MyOrder from './pages/MyOrder'
import About from './pages/About'
import Contact from './pages/Contact'
import Help from './pages/Help'
import Returns from './pages/Returns'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'

import Signup from './pages/Signup'
import Login from './pages/Login'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Verify from './pages/Verify'
import VerifyEmail from './pages/VerifyEmail'
import Footer from './components/Footer'
import Profile from './pages/Profile'
import Products from './pages/Products'
import Cart from './pages/Cart'
import Dashboard from './pages/Dashboard'
import AdminSales from './pages/admin/AdminSales'
import AddProduct from './pages/admin/AddProduct'
import AdminProduct from './pages/admin/AdminProduct'
import AdminOrder from './pages/admin/AdminOrder'
import ShowUserOrders from './pages/admin/ShowUserOrders'
import AdminUser from './pages/admin/AdminUser'
import ProtectedRoute from './components/ProtectedRoute'
import SingleProduct from './pages/SingleProduct'
import UserInfo from './pages/admin/UserInfo'
import AddressForm from './pages/AddressForm'
import OrderSuccess from './pages/OrderSuccess'

const router = createBrowserRouter([
    {
        path: '/',
        element: <><Navbar /><Home /><Footer /></>
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/register',
        element: <Signup />
    },
    {
        path: '/verify',
        element: <Verify />
    },
    {
        path: '/verify/*',
        element: <VerifyEmail />
    },
    {
        path: '/profile',
        element:
            <ProtectedRoute>
                <Navbar />
                <Profile />
            </ProtectedRoute>
    },
    {
    path: '/about',
    element:
        <>
            <Navbar />
            <About />
            <Footer />
        </>
},
{
    path: '/contact',
    element:
        <>
            <Navbar />
            <Contact />
            <Footer />
        </>
},
{
    path: '/help',
    element:
        <>
            <Navbar />
            <Help />
            <Footer />
        </>
},
{
    path: '/returns',
    element:
        <>
            <Navbar />
            <Returns />
            <Footer />
        </>
},
{
    path: '/privacy',
    element:
        <>
            <Navbar />
            <Privacy />
            <Footer />
        </>
},
{
    path: '/terms',
    element:
        <>
            <Navbar />
            <Terms />
            <Footer />
        </>
},
    {
        path: '/products',
        element:
            <>
                <Navbar />
                <Products />
                <Footer />
            </>
    },
    {
        path: '/products/:id',
        element:
            <>
                <Navbar />
                <SingleProduct />
            </>
    },
    {
        path: '/cart',
        element:
            <ProtectedRoute>
                <Navbar />
                <Cart />
            </ProtectedRoute>
    },
    {
        path: '/address',
        element:
            <ProtectedRoute>
                <AddressForm />
            </ProtectedRoute>
    },
      {
        path: '/order-success',
        element:
            <ProtectedRoute>
                <OrderSuccess/>
            </ProtectedRoute>
    },
    {
      path: '/orders',
      element:
        <ProtectedRoute>
            <Navbar />
            <MyOrder />
        </ProtectedRoute>
   },
    {
        path: '/dashboard',
        element:
            <ProtectedRoute adminOnly={true}>
                <Navbar />
                <Dashboard />
            </ProtectedRoute>,
        children: [
            {
                path: 'sales',
                element: <AdminSales />
            },
            {
                path: 'add-product',
                element: <AddProduct />
            },
            {
                path: 'products',
                element: <AdminProduct />
            },
            {
                path: 'orders',
                element: <AdminOrder />
            },
            {
                path: 'users/orders/:userId',
                element: <ShowUserOrders />
            },
            {
                path: 'users',
                element: <AdminUser />
            },
            {
                path: 'users/:id',
                element: <UserInfo />
            }
        ]
    }
])

function App() {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true)

   useEffect(() => {
    const initializeApp = async () => {
        const storedUser = localStorage.getItem('user')
        const accessToken = localStorage.getItem('accessToken')

        if (storedUser) {
            dispatch(setUser(JSON.parse(storedUser)))
        }

        if (accessToken) {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_URL}/api/v1/cart`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                )

                if (res.data.success) {
                    dispatch(setCart(res.data.cart))
                }
            } catch (error) {
                console.log('Failed to load cart:', error)
            }
        }

        setLoading(false)
    }

    initializeApp()
}, [dispatch])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading...
            </div>
        )
    }

    return <RouterProvider router={router} />
}

export default App
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import axios from 'axios'
import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Camera, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import userLogo from '../../assets/user-logo.webp'

const UserInfo = () => {

    const navigate = useNavigate()
    const location = useLocation()

    const selectedUser = location.state?.user

    const accessToken = localStorage.getItem('accessToken')

    const [loading, setLoading] = useState(false)
    const [file, setFile] = useState(null)

    const [updateUser, setUpdateUser] = useState({
        firstName: selectedUser?.firstName || '',
        lastName: selectedUser?.lastName || '',
        email: selectedUser?.email || '',
        phoneNo: selectedUser?.phoneNo || '',
        address: selectedUser?.address || '',
        city: selectedUser?.city || '',
        zipCode: selectedUser?.zipCode || '',
        profilePic: selectedUser?.profilePic || '',
        role: selectedUser?.role || 'user',
    })

    const handleChange = (e) => {

        const { name, value } = e.target

        setUpdateUser((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleFileChange = (e) => {

        const selectedFile = e.target.files[0]

        if (!selectedFile) return

        setFile(selectedFile)

        setUpdateUser((prev) => ({
            ...prev,
            profilePic: URL.createObjectURL(selectedFile)
        }))
    }

    const submitHandler = async (e) => {

        e.preventDefault()

        try {

            setLoading(true)

            const formData = new FormData()

            formData.append('firstName', updateUser.firstName)
            formData.append('lastName', updateUser.lastName)
            formData.append('email', updateUser.email)
            formData.append('phoneNo', updateUser.phoneNo)
            formData.append('address', updateUser.address)
            formData.append('city', updateUser.city)
            formData.append('zipCode', updateUser.zipCode)
            formData.append('role', updateUser.role)

            if (file) {
                formData.append('file', file)
            }

            const res = await axios.put(
                `${import.meta.env.VITE_URL}/api/v1/user/update/${selectedUser?._id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            )

            if (res.data.success) {

                toast.success(
                    res.data.message || 'Profile updated successfully'
                )

                navigate('/dashboard/users')
            }

        } catch (error) {

            console.log(error)

            toast.error(
                error.response?.data?.message ||
                'Failed to update profile'
            )

        } finally {

            setLoading(false)
        }
    }

    if (!selectedUser) {

        return (
            <div className='min-h-screen bg-gray-100 flex items-center justify-center p-6'>

                <Card className='w-full max-w-md'>

                    <CardHeader>
                        <CardTitle>
                            User Not Found
                        </CardTitle>

                        <CardDescription>
                            User information could not be loaded.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>

                        <Button
                            onClick={() => navigate('/dashboard/users')}
                            className='bg-pink-600 hover:bg-pink-700'
                        >
                            Go Back
                        </Button>

                    </CardContent>

                </Card>

            </div>
        )
    }

    return (

        <div className='min-h-screen bg-gray-100 px-6 py-10'>

            <div className='max-w-4xl mx-auto'>

                <div className='flex items-center gap-4 mb-6'>

                    <Button
                        type='button'
                        onClick={() => navigate(-1)}
                        className='h-10 w-10 p-0 bg-gray-900 hover:bg-gray-800 cursor-pointer'
                    >
                        <ArrowLeft size={18} />
                    </Button>

                    <div>

                        <h1 className='text-2xl font-bold text-gray-800'>
                            Update Profile
                        </h1>

                    </div>

                </div>

                <div className='flex items-start justify-center gap-8'>

                    <div className='w-44 flex flex-col items-center pt-2'>

                        <div className='relative'>

                            <img
                                src={
                                    updateUser.profilePic ||
                                    userLogo
                                }
                                alt='User Profile'
                                className='
                                    w-36
                                    h-36
                                    rounded-full
                                    object-cover
                                    border-4
                                    border-white
                                    ring-2
                                    ring-pink-700
                                    shadow-md
                                '
                            />

                            <label
                                htmlFor='profile-image'
                                className='
                                    absolute
                                    bottom-1
                                    right-1
                                    w-9
                                    h-9
                                    rounded-full
                                    bg-pink-600
                                    hover:bg-pink-700
                                    text-white
                                    flex
                                    items-center
                                    justify-center
                                    cursor-pointer
                                    shadow-md
                                '
                            >

                                <Camera size={17} />

                            </label>

                            <input
                                id='profile-image'
                                type='file'
                                accept='image/*'
                                onChange={handleFileChange}
                                className='hidden'
                            />

                        </div>

                        <label
                            htmlFor='profile-image'
                            className='
                                mt-4
                                px-5
                                py-2
                                rounded-md
                                bg-pink-600
                                hover:bg-pink-700
                                text-white
                                text-sm
                                font-medium
                                cursor-pointer
                                whitespace-nowrap
                            '
                        >
                            Change Picture
                        </label>

                    </div>

                    <Card className='w-[475px] shadow-md border-0'>

                        <CardContent className='pt-6'>

                            <form onSubmit={submitHandler}>

                                <div className='flex flex-col gap-4'>

                                    <div className='grid grid-cols-2 gap-4'>

                                        <div className='grid gap-1.5'>

                                            <Label>
                                                First Name
                                            </Label>

                                            <Input
                                                type='text'
                                                name='firstName'
                                                value={updateUser.firstName}
                                                onChange={handleChange}
                                                placeholder='Enter your First Name'
                                                required
                                            />

                                        </div>

                                        <div className='grid gap-1.5'>

                                            <Label>
                                                Last Name
                                            </Label>

                                            <Input
                                                type='text'
                                                name='lastName'
                                                value={updateUser.lastName}
                                                onChange={handleChange}
                                                placeholder='Enter your Last Name'
                                                required
                                            />

                                        </div>

                                    </div>

                                    <div className='grid gap-1.5'>

                                        <Label>
                                            Email
                                        </Label>

                                        <Input
                                            type='email'
                                            name='email'
                                            value={updateUser.email}
                                            disabled
                                            className='bg-gray-50'
                                        />

                                    </div>

                                    <div className='grid gap-1.5'>

                                        <Label>
                                            Phone Number
                                        </Label>

                                        <Input
                                            type='text'
                                            name='phoneNo'
                                            value={updateUser.phoneNo}
                                            onChange={handleChange}
                                            placeholder='Enter your Contact No'
                                        />

                                    </div>

                                    <div className='grid gap-1.5'>

                                        <Label>
                                            Address
                                        </Label>

                                        <Input
                                            type='text'
                                            name='address'
                                            value={updateUser.address}
                                            onChange={handleChange}
                                            placeholder='Enter your Address'
                                        />

                                    </div>

                                    <div className='grid grid-cols-2 gap-4'>

                                        <div className='grid gap-1.5'>

                                            <Label>
                                                City
                                            </Label>

                                            <Input
                                                type='text'
                                                name='city'
                                                value={updateUser.city}
                                                onChange={handleChange}
                                                placeholder='Enter your City'
                                            />

                                        </div>

                                        <div className='grid gap-1.5'>

                                            <Label>
                                                Zip Code
                                            </Label>

                                            <Input
                                                type='text'
                                                name='zipCode'
                                                value={updateUser.zipCode}
                                                onChange={handleChange}
                                                placeholder='Enter your ZipCode'
                                            />

                                        </div>

                                    </div>

                                    <div className='flex items-center gap-4 mt-1'>

                                        <Label className='text-sm font-medium'>
                                            Role :
                                        </Label>

                                        <label className='flex items-center gap-2 cursor-pointer'>

                                            <input
                                                type='radio'
                                                name='role'
                                                value='user'
                                                checked={
                                                    updateUser.role === 'user'
                                                }
                                                onChange={handleChange}
                                                className='accent-pink-600'
                                            />

                                            <span>
                                                User
                                            </span>

                                        </label>

                                        <label className='flex items-center gap-2 cursor-pointer'>

                                            <input
                                                type='radio'
                                                name='role'
                                                value='admin'
                                                checked={
                                                    updateUser.role === 'admin'
                                                }
                                                onChange={handleChange}
                                                className='accent-pink-600'
                                            />

                                            <span>
                                                Admin
                                            </span>

                                        </label>

                                    </div>

                                    <Button
                                        disabled={loading}
                                        type='submit'
                                        className='
                                            w-full
                                            bg-pink-600
                                            hover:bg-pink-700
                                            cursor-pointer
                                            mt-2
                                        '
                                    >

                                        {loading ? (

                                            <span className='flex items-center gap-2'>

                                                <Loader2
                                                    size={18}
                                                    className='animate-spin'
                                                />

                                                Please wait

                                            </span>

                                        ) : (

                                            'Update Profile'

                                        )}

                                    </Button>

                                </div>

                            </form>

                        </CardContent>

                    </Card>

                </div>

            </div>

        </div>
    )
}

export default UserInfo
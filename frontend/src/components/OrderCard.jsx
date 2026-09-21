import { ArrowLeft } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const OrderCard = ({ userOrder }) => {
    const navigate = useNavigate()

    return (
        <div className='pl-[350px] py-20 pr-20 flex flex-col gap-3'>
            <div className='w-full p-6'>
                <div className='flex items-center gap-4 mb-6'>
                    <button onClick={() => navigate(-1)}>
                        <ArrowLeft />
                    </button>
                    <h1 className='text-2xl font-bold'>Orders</h1>
                </div>

                {
                    userOrder?.length === 0 ? (
                        <p className='text-gray-800 text-2xl'>No Orders found for this user</p>
                    ) : (
                        <div className='space-y-6 w-full'>
                            {
                                userOrder?.map((order) => (
                                    <div key={order._id} className='shadow-lg rounded-2xl p-5 border border-gray-200'>
                                        {/* Order Header */}
                                        <div className='flex justify-between items-center mb-4'>
                                            <h2 className='text-lg font-semibold'>
                                                Order ID: <span className='text-gray-600'>{order._id}</span>
                                            </h2>
                                            <p className='text-sm text-gray-500'>
                                                Amount:{' '}
                                                <span className='font-bold'>
                                                    {order.currency} {order.amount.toFixed(2)}
                                                </span>
                                            </p>
                                        </div>

                                        {/* User Info */}
                                        <div className='flex justify-between items-center'>
                                            <div>
                                                <p className='text-sm text-gray-700'>
                                                    <span className='font-medium'>User:</span>{' '}
                                                    {order.user?.firstName || 'Unknown'} {order.user?.lastName || ''}
                                                </p>
                                                <p className='text-sm text-gray-500'>
                                                    Email: {order.user?.email || 'N/A'}
                                                </p>
                                            </div>
                                            <span
                                                className={`${
                                                    order.status === 'Paid'
                                                        ? 'bg-green-500'
                                                        : order.status === 'Failed'
                                                        ? 'bg-red-500'
                                                        : 'bg-orange-300'
                                                } text-white px-2 py-1 rounded-lg`}
                                            >
                                                {order.status}
                                            </span>
                                        </div>

                                        {/* Products Section */}
                                        {order.products?.length > 0 && (
                                            <div className='mt-4 border-t pt-4'>
                                                <p className='text-sm font-semibold text-gray-700 mb-3'>
                                                    Products:
                                                </p>

                                                <div className='space-y-3'>
                                                    {order.products.map((item, idx) => (
                                                        <div
                                                            key={idx}
                                                            className='flex items-center gap-4 bg-gray-50 rounded-lg p-3'
                                                        >
                                                            {/* Product Image */}
                                                            <img
                                                                src={item.productId?.productImg?.[0]?.url}
                                                                alt={item.productId?.productName}
                                                                className='w-14 h-14 object-cover rounded-md border'
                                                            />

                                                            {/* Product Details */}
                                                            <div className='flex-1'>
                                                                <p className='text-sm font-medium text-gray-800 line-clamp-2'>
                                                                    {item.productId?.productName || 'Product'}
                                                                </p>
                                                            </div>

                                                            {/* Price × Quantity */}
                                                            <div className='text-right'>
                                                                <p className='text-sm font-semibold text-gray-800'>
                                                                    ₹{item.productId?.productPrice} × {item.quantity}
                                                                </p>
                                                                <p className='text-xs text-gray-500'>
                                                                    Subtotal: ₹
                                                                    {(item.productId?.productPrice || 0) * item.quantity}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            }
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default OrderCard
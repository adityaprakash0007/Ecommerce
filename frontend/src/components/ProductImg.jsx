import React, { useState, useEffect } from 'react'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

const ProductImg = ({ images }) => {
    const [mainImg, setMainImg] = useState('');

    useEffect(() => {
        if (images && images.length > 0) {
            setMainImg(images[0].url);
        }
    }, [images]);

    // Default placeholder image
    const DEFAULT_IMAGE = 'https://via.placeholder.com/500x400?text=No+Image';

    if (!images || images.length === 0) {
        return (
            <div className='flex gap-5 w-max'>
                <div className='gap-5 flex flex-col'>
                    {[1, 2, 3, 4].map((_, index) => (
                        <div key={index} className='w-20 h-20 bg-gray-200 rounded-lg border animate-pulse'></div>
                    ))}
                </div>
                <Zoom>
                    <img
                        src={DEFAULT_IMAGE}
                        alt="No image available"
                        className='w-[500px] h-[400px] object-contain border shadow-lg rounded-lg'
                    />
                </Zoom>
            </div>
        );
    }

    return (
        <div className='flex gap-5 w-max'>
            <div className='gap-5 flex flex-col'>
                {images.map((img, index) => (
                    <img
                        key={index}
                        onClick={() => setMainImg(img.url)}
                        src={img.url}
                        alt={`Thumbnail ${index + 1}`}
                        className={`cursor-pointer w-20 h-20 border shadow-lg rounded-lg object-cover transition-all duration-200 ${
                            mainImg === img.url ? 'ring-2 ring-[#6B5344]' : 'hover:opacity-80'
                        }`}
                    />
                ))}
            </div>

            <Zoom>
                <img
                    src={mainImg || images[0]?.url}
                    alt="Product main"
                    className='w-[500px] h-[450px] object-contain shadow-lg rounded-xl'
                />
            </Zoom>
        </div>
    )
}

export default ProductImg
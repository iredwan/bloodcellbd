'use client';

import { useState, useEffect } from 'react';
import Slider from 'react-slick';
import Link from 'next/link';
// Custom dot component to ensure dots are visible
const CustomDot = (props) => {
  const { onClick, active } = props;
  return (
    <div
      className={`inline-block mx-1 cursor-pointer`}
      onClick={onClick}
    >
      <div 
        className={`w-3 h-3 rounded-full transition-all duration-300 ${active ? 'bg-[#8a0303]' : 'bg-[#8a0303] bg-opacity-50'}`}
        style={{ boxShadow: active ? '0 0 5px rgba(255, 255, 255, 0.8)' : 'none' }}
      ></div>
    </div>
  );
};

const Carousel = ({ 
  items = [], 
  isLoading = false, 
  error = null,
  autoplay = true,
  width = '100%',
  autoplaySpeed = 5000,
  dots = true,
  arrows = true,
  infinite = true,
  speed = 500,
  slidesToShow = 1,
  slidesToScroll = 1,
  responsive = [
    {
      breakpoint: 768,
      settings: {
        arrows: false
      }
    }
  ]
}) => {
  // Default slider settings
  const settings = {
    dots,
    infinite,
    
    speed,
    slidesToShow,
    slidesToScroll,
    autoplay,
    autoplaySpeed,
    arrows,
    responsive,
    cssEase: 'linear',
    fade: true,
    dotsClass: 'slick-dots custom-dots',
    customPaging: (i) => <CustomDot />,
    appendDots: dots => (
      <div style={{ position: 'absolute', bottom: '20px', width: '100%', textAlign: 'center', zIndex: 10 }}>
        <ul style={{ margin: '0', padding: '0', listStyle: 'none', display: 'inline-block' }}>{dots}</ul>
      </div>
    )
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
          {[...Array(1)].map((_, index) => (
            <div
              key={index}
              className="w-full h-[200px] md:h-[400px] lg:h-[600px] bg-gray-200 dark:bg-gray-700 relative overflow-hidden"
            >
              <div className="flex justify-center items-end h-full">
                <div className="w-3 h-3 mb-6 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                <div className="w-3 h-3 mb-6 mx-2 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                <div className="w-3 h-3 mb-6 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
    );
  }

  if (error) {
    console.error('Error loading carousel:', error);
    return (
      <div className="flex justify-center items-center text-red-500">
        <p>Failed to load carousel. Please try again later.</p>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="bg-gray-100 flex justify-center items-center rounded-lg dark:bg-gray-800 dark:text-white" >
        <p className="text-lg text-gray-500">No carousel items available</p>
      </div>
    );
  }

  return (
    <div  className={`carousel-container relative overflow-hidden ${width === '100%' ? 'w-full' : ''}`}
    style={width !== '100%' ? { width } : {}}>

        <Slider {...settings}>
          {items.map((item, index) => (
            <div key={item._id || index} className="outline-none h-full">
              <div className="relative w-full h-full">
                {item.linkUrl ? (
                  <Link href={item.linkUrl} className="block w-full h-full">
                    <img
                      src={'/image/WhatsApp Image 2023-10-26 at 21.29.26_443ae622.jpg'}
                      alt={item.title || `Carousel item ${index + 1}`}
                      className="w-full h-full object-contain md:object-cover"
                      style={{ maxHeight: '100%', width: '100%' }}
                    />
                    {(item.title || item.subtitle) && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
                        {item.title && <h3 className="text-xl font-bold">{item.title}</h3>}
                        {item.subtitle && <p>{item.subtitle}</p>}
                      </div>
                    )}
                  </Link>
                ) : (
                  <div className="relative">
                    <img
                      src={item.imageUrl}
                      alt={item.title || `Carousel item ${index + 1}`}
                      className="w-full h-full object-contain md:object-cover"
                      style={{ maxHeight: '100%', width: '100%' }}
                    />
                    {(item.title || item.subtitle) && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
                        {item.title && <h3 className="text-xl font-bold">{item.title}</h3>}
                        {item.subtitle && <p>{item.subtitle}</p>}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </Slider>
    </div>
  );
  
  
};

export default Carousel; 
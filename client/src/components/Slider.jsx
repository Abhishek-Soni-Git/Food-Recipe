// src/components/Slider.js

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { Link } from 'react-router-dom';

const Slider = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get('http://localhost:3001/recipes/latest-images');
        console.log(response.data)
        setImages(response.data);
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchImages();
  }, []);

  return (
    <Swiper
    spaceBetween={30}
    centeredSlides={true}
    autoplay={{
      delay: 2500,
      disableOnInteraction: false,
    }}
    modules={[Pagination, Autoplay]} // Include Autoplay here
    pagination={{ clickable: true }}
    navigation={true}
    >
      {images.map((slide)=> (
        <SwiperSlide key={slide._id}>
          <Link to={"/recipe/"+slide._id}>
          <img className='w-full object-cover aspect-video' src={import.meta.env.VITE_BACKEND_URL + slide.imageUrl} alt={slide.name} />
          <h2>{slide.name}</h2>
          </Link>
      </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Slider;
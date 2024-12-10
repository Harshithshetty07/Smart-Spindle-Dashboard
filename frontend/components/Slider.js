'use client'

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import './slider.css'

const Sliding_data = [
    {
        title: "Current",
        path: 'current'
    },
    {
        title: "Temperature",
        path: 'temperature'
    },
    {
        title: "Vibration",
        path: 'vibration'
    },
];

export default function Home() {
  const router = useRouter();
  const [active, setActive] = useState(1);
  const listRef = useRef(null);
  const circleRef = useRef(null);
  const images = [
    '/images/6.png.jpeg',
    '/images/7.jpg',
    '/images/8.png',
    '/images/6.png.jpeg',
    '/images/7.jpg',
  ];

  useEffect(() => {
    const list = listRef.current;
    const circle = circleRef.current;
    const items = list.querySelectorAll('.item');
    const count = items.length;
    
    const runCarousel = () => {
      const prevButton = document.getElementById('prev');
      const nextButton = document.getElementById('next');
      
      prevButton.style.display = active === 0 ? 'none' : 'block';
      nextButton.style.display = active === count - 1 ? 'none' : 'block';
      
      const oldActive = list.querySelector('.item.active');
      if (oldActive) oldActive.classList.remove('active');
      
      items[active].classList.add('active');
      
      const width_item = items[active].offsetWidth;
      const leftTransform = width_item * (active - 1) * -1;
      list.style.transform = `translateX(${leftTransform}px)`;
    };

    const textCircle = circle.innerText.split('');
    circle.innerText = '';
    textCircle.forEach((value, key) => {
      const newSpan = document.createElement('span');
      newSpan.innerText = value;
      newSpan.classList.add('circle-span');
      const rotateThisSpan = (360 / textCircle.length) * (key + 1);
      newSpan.style.setProperty('--rotate', rotateThisSpan + 'deg');
      circle.appendChild(newSpan);
    });

    runCarousel();
  }, [active]);

  const handleNext = () => {
    setActive(prevActive => 
      prevActive >= images.length - 1 ? images.length - 1 : prevActive + 1
    );
  };

  const handlePrev = () => {
    setActive(prevActive => 
      prevActive <= 0 ? 0 : prevActive - 1
    );
  };

  const handleSeeMore = () => {
    // Navigate to the path corresponding to the current active slide
    // Use modulo to ensure it wraps around if needed
    const currentSlideIndex = active % Sliding_data.length;
    const currentPath = Sliding_data[currentSlideIndex].path;
    router.push(`/${currentPath}`);
  };

  return (
    <div className="font-poppins m-0 overflow-hidden ">
      <div className="w-full h-screen relative bg-[#17232A] 
        bg-[radial-gradient(#fff3,transparent_50%)] -mt-[50px]">
        <div 
          ref={listRef}
          className="absolute w-max h-full flex justify-start items-center transition-transform duration-[800ms]"
        >
          {images.map((src, index) => (
            <div 
              key={index} 
              className={`w-[calc(100vw/3)] text-center 
                rotate-45 transition-transform duration-1000 
                ${index === active ? '!rotate-0' : ''} item`}
            >
              <img 
                src={src} 
                alt={`Slide ${index + 1}`} 
                className="slide w-[65%] filter drop-shadow-[0_0_20px_#000]" 
              />
            </div>
          ))}
        </div>

        {/* Circle Background */}
        <div 
          ref={circleRef}
          className="pointer-events-none absolute inset-0 
            slider-mask
            backdrop-blur-[10px] 
            bg-[radial-gradient(calc(100vw/6+1px),#eee5_100%,#eee2)]"
        >
          Lun dev - frontend design - web design
        </div>

        {/* Content */}
        <div className="absolute bottom-[5%] left-1/2 -translate-x-1/2 text-center text-[#eee] w-max">
          <button 
            onClick={handleSeeMore}
            className="border border-[#eee5] bg-transparent text-[#eee] 
            font-poppins tracking-[5px] px-5 py-4 rounded-[20px]"
          >
            See more {Sliding_data[active % Sliding_data.length].title}
          </button>
        </div>

        {/* Navigation Buttons */}
        <button 
          id="prev" 
          onClick={handlePrev}
          className={`absolute top-1/2 -translate-y-1/2 w-[70px] h-[70px] 
            rounded-full bg-black border border-[#eee8] 
            text-white text-xl font-mono cursor-pointer z-[15] left-5 
            ${active === 0 ? 'hidden' : ''}`}
        >
          &lt;
        </button>
        <button 
          id="next" 
          onClick={handleNext}
          className={`absolute top-1/2 -translate-y-1/2 w-[70px] h-[70px] 
            rounded-full bg-black border border-[#eee8] 
            text-white text-xl font-mono cursor-pointer z-[15] right-5 
            ${active === images.length - 1 ? 'hidden' : ''}`}
        >
          &gt;
        </button>
      </div>
    </div>
  );
}
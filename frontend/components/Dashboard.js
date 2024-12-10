'use client'

import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';


const Dashboard = () => {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselData = [
    {
      category: 'Category 1',
      title: 'Vibration ',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio quas, ipsum exercitationem mollitia saepe neque aut corporis officiis excepturi architecto?',
      image: '/images/spindle2.png',
      path: 'vibration'
    },
    {
      category: 'Category 2',
      title: 'Current',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio quas, ipsum exercitationem mollitia saepe neque aut corporis officiis excepturi architecto?',
      image: '/images/spindle.png',
      path: 'current'
    },
    {
      category: 'Category 3',
      title: 'Temperature',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio quas, ipsum exercitationem mollitia saepe neque aut corporis officiis excepturi architecto?',
      image: '/images/spindle2.png',
      path: 'temperature'
    }
  ];

  const updateCarousel = useCallback((newIndex) => {
    let adjustedIndex = newIndex;
    if (adjustedIndex >= carouselData.length) adjustedIndex = 0;
    if (adjustedIndex < 0) adjustedIndex = carouselData.length - 1;

    setCurrentSlide(adjustedIndex);
  }, [carouselData.length]);

  const nextSlide = useCallback(() => {
    updateCarousel(currentSlide + 1);
  }, [currentSlide, updateCarousel]);

  const prevSlide = useCallback(() => {
    updateCarousel(currentSlide - 1);
  }, [currentSlide, updateCarousel]);

  const handleSeeMore = useCallback(() => {
    // Navigate to the path of the current slide
    const currentPath = carouselData[currentSlide].path;
    router.push(`/${currentPath}`);
  }, [currentSlide, router, carouselData]);

  useEffect(() => {
    const autoPlayInterval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(autoPlayInterval);
  }, [nextSlide]);

  return (
    <div className="bg-[#232442] text-white font-poppins">
      {/* Header */}
      <header className="fixed z-10 w-[min(1200px,90vw)] h-[70px] left-1/2 -translate-x-1/2 grid grid-cols-[1fr_calc(200px*3)] gap-x-[10%] items-center">
        <figure className="logo">
          <img src="/star.svg" alt="" className="w-[50px]" />
        </figure>
        <nav>
          <ul className="grid grid-cols-[repeat(3,200px)]">
            <li>HOME</li>
            <li>INFO</li>
            <li>LOGIN</li>
          </ul>
        </nav>
      </header>

      {/* Carousel */}
      <section 
        className="bg-gradient-to-r from-[#2b2e4f] to-[#111126] h-screen overflow-hidden relative"
      >
        <div className="w-[min(1200px,90vw)] mx-auto h-full relative">
          {carouselData.map((slide, index) => {
            // Calculate the slide translation based on current slide
            const calculation = index < currentSlide ? 1 : 
                               index > currentSlide ? 1 : 0;

            return (
              <div 
                key={index} 
                className={`
                  carousel-item
                  absolute inset-0 
                  ${index === currentSlide ? 'active' : ''}
                `}
                style={{
                  '--calculation': calculation
                }}
              >
                {/* Product Image */}
                <figure className="absolute w-[70%] top-1/2 -translate-y-1/2 
                  before:content-[''] before:absolute before:bg-black 
                  before:w-full before:h-[100px] before:top-[150%] 
                  before:left-[50px] before:rounded-full before:blur-[50px]">
                  <img 
                    src={slide.image} 
                    alt={slide.title} 
                    className="w-full carousel-image"
                    width="200" 
                    height="650" 
                  />
                </figure>

                {/* Content */}
                <div className="absolute z-20 w-[70%] h-full right-[200px] 
                  flex flex-col justify-center items-end gap-5">
                  <p className="category font-medium">{slide.category}</p>
                  <h2 className="carousel-title font-poppins text-[8em] leading-none">
                    {slide.title}
                  </h2>
                  <p className="description text-white/50 max-w-[450px] text-[1rem] font-semibold text-right">
                    {slide.description}
                  </p>
                  
                  <div className="more grid grid-cols-[120px_120px] gap-5 grid-rows-[60px]">
                    <button 
                      onClick={handleSeeMore}
                      className="rounded-[30px] font-league-gothic text-white 
                      border-2 border-transparent bg-clip-padding 
                      bg-gradient-to-r from-[#242745] to-[#242745] 
                      border-gradient-to-l from-[#81baa0] border-[#46a39a]"
                    >
                      See More
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Vertical and Horizontal Lines */}
          <div 
            className="absolute right-[200px] w-[200px] h-full 
            border-l border-r border-[#324073] pointer-events-none"
          />
          <div 
            className="absolute h-[250px] w-full 
            border-t border-b border-[#324073] top-[51%] pointer-events-none"
          />
        </div>

        {/* Navigation Arrows */}
        <div 
          className="w-[min(1200px,90vw)] absolute top-[50%] left-1/2 
          -translate-x-1/2 -translate-y-[25px] z-100 flex justify-between"
        >
          <button 
            onClick={prevSlide}
            className="w-[70px] h-[70px] rounded-full 
            border border-[#659cdf55] bg-[#232442] 
            text-white/50 font-mono text-lg 
            hover:border-[#659cdf] hover:text-white flex  justify-center items-center
            transition-colors duration-500"
          >
            <ChevronLeft />
          </button>
          <button 
            onClick={nextSlide}
            className="w-[70px] h-[70px] rounded-full 
            border border-[#659cdf55] bg-[#232442] 
            text-white/50 font-mono text-lg 
            hover:border-[#659cdf] hover:text-white flex  justify-center items-center
            transition-colors duration-500"
          >
            <ChevronRight />
          </button>
        </div>

        {/* Indicators */}
        <div 
          className="absolute top-[56%] h-[200px] 
          w-[min(1200px,90vw)] left-1/2 -translate-x-1/2 
          flex flex-col justify-end gap-2.5"
        >
          <div className="font-league-gothic text-[7vw]">
            {(currentSlide + 1).toString().padStart(2, '0')}
          </div>
          <ul className="flex gap-2.5">
            {carouselData.map((_, index) => (
              <li 
                key={index} 
                className={`w-[50px] h-[5px] rounded-[10px] 
                  cursor-pointer transition-colors duration-500 
                  ${index === currentSlide 
                    ? 'bg-yellow-500' 
                    : 'bg-[#659cdf]'
                  }`}
                onClick={() => updateCarousel(index)}
              />
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
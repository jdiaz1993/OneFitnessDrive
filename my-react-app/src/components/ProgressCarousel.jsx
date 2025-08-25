import React, { useEffect, useRef } from 'react';
import Carousel from 'bootstrap/js/dist/carousel'; // if you aren't loading the global bundle
import c1 from '../client1.JPG';
import c2 from '../client2.JPG';
import c3 from '../client3.JPG';
import c4 from '../client4.JPG';
import c5 from '../client5.JPG';
import c6 from '../client6.JPG';

export default function ProgressCarousel({
  mode = 'contain',          // 'contain' | 'cover'
  aspect = null,             // null | '16x9' | '4x3' | '1x1' | '21x9'
  interval = 4000,
  objectPosition = 'center', // e.g. 'center top' for cover
  minPx = 240,               // only used when aspect === null
  maxVh = '55vh',            // only used when aspect === null
  maxPx = 640,               // only used when aspect === null
  className = '',
  id = 'carouselExampleRide'
}) {
  const slides = [c1, c2, c3, c4, c5, c6];
  const ref = useRef(null);

  // If you already load 'bootstrap.bundle.min.js' globally, you can delete this effect.
  useEffect(() => {
    if (!ref.current) return;
    const instance = new Carousel(ref.current, {
      interval,
      ride: 'carousel',
      pause: 'hover',
      touch: true,
      wrap: true
    });
    return () => instance.dispose();
  }, [interval]);

  // Compute image style
  const imgStyleBase = {
    width: '100%',
    objectFit: mode === 'contain' ? 'contain' : 'cover',
    objectPosition
  };

  // If using a fixed aspect box, the img should fill that box
  const imgStyleAspect = { ...imgStyleBase, width: '100%', height: '100%' };

  // If NOT using aspect, use a responsive clamp height window
  const imgStyleClamp = {
    ...imgStyleBase,
    height: `clamp(${minPx}px, ${maxVh}, ${maxPx}px)`
  };

  return (
    <div id={id} className={`carousel slide ${className}`} ref={ref}>
      <div className="carousel-inner">
        {slides.map((src, i) => (
          <div className={`carousel-item ${i === 0 ? 'active' : ''}`} key={i}>
            {aspect ? (
              <div className={`ratio ratio-${aspect} bg-black`}>
                <img src={src} alt={`client ${i + 1}`} className="w-100 h-100" style={imgStyleAspect} />
              </div>
            ) : (
              <img src={src} alt={`client ${i + 1}`} className="d-block w-100" style={imgStyleClamp} />
            )}
          </div>
        ))}
      </div>

      <button className="carousel-control-prev" type="button" data-bs-target={`#${id}`} data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true" />
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target={`#${id}`} data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true" />
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
}

import React, { useEffect, useRef } from 'react';

export const ScrollToElement = () => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (elementRef.current !== null)
      elementRef.current.scrollIntoView({ behavior: 'smooth' });
  });

  return <div ref={elementRef} />;
};

export default ScrollToElement;

import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import './loader.css'
const Spinner = () => {
    useEffect(() => {
        gsap.fromTo(
            '.reverse-round',
            {
                rotate: 0,
                scale: 0.5,
            },
            {
                ease: 'power4.inOut',
                rotate: 180,
                scale: 1,
                stagger: 0.05,
                yoyo: true,
                repeat: -1,
            }
        );
    }, []);

    return (
        <div className='body-main'>
        <div id="container">
            <div className="reverse-round" id="circle1"></div>
            <div className="reverse-round" id="circle2"></div>
            <div className="reverse-round" id="circle3"></div>
            <div className="reverse-round" id="circle4"></div>
            <div className="reverse-round" id="circle5"></div>
        </div>
        </div>
    );
};

export default Spinner;

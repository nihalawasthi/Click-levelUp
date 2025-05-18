'use client'

export default function BackGround() {

    return (
        <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[#0a0e17]"></div>
            <div className="absolute inset-0 opacity-20">
                <div className="h-full w-full grid grid-cols-12 grid-rows-12">
                    <div className="absolute w-[1px] h-[1px] bg-[#bcffff] shadow-glow animate-ping" style={{ top: '15%', left: '10%' }}></div>
                    <div className="absolute w-[2px] h-[2px] bg-[#bcffff] shadow-glow animate-ping" style={{ top: '25%', left: '20%', animationDelay: '0.5s' }}></div>
                    <div className="absolute w-[1px] h-[1px] bg-[#bcffff] shadow-glow animate-ping" style={{ top: '35%', left: '80%', animationDelay: '1s' }}></div>
                    <div className="absolute w-[2px] h-[2px] bg-[#bcffff] shadow-glow animate-ping" style={{ top: '65%', left: '75%', animationDelay: '1.5s' }}></div>
                    <div className="absolute w-[1px] h-[1px] bg-[#bcffff] shadow-glow animate-ping" style={{ top: '85%', left: '30%', animationDelay: '2s' }}></div>
                    <div className="absolute w-[2px] h-[2px] bg-[#bcffff] shadow-glow animate-ping" style={{ top: '45%', left: '50%', animationDelay: '2.5s' }}></div>
                </div>
            </div>

            {/* Hexagonal grid pattern */}
            <div className="absolute inset-0 opacity-10">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <pattern id="hexPattern" width="50" height="43.4" patternUnits="userSpaceOnUse">
                        <path d="M25,0 L50,14.4 L50,43.4 L25,43.4 L0,43.4 L0,14.4 Z" fill="none" stroke="#bcffff" strokeWidth="0.5"></path>
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#hexPattern)"></rect>
                </svg>
            </div>

            {/* Digital circuit lines */}
            <div className="absolute inset-0 opacity-10">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0,100 H1000 M200,0 V800 M400,0 V800 M600,0 V800 M800,0 V800" stroke="#bcffff" strokeWidth="0.5"></path>
                    <path d="M0,200 H1000 M0,400 H1000 M0,600 H1000" stroke="#bcffff" strokeWidth="0.5"></path>
                </svg>
            </div>
        </div>
    );
}

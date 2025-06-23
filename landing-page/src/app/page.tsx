"use client"
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from 'react';

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div>
    <div className="relative w-full h-[600px] overflow-hidden bg-black">
      <Image 
        src="/MikeMentzer2.jpg"
        alt="Image of Mike Mentzer"
        width={834}
        height={1235}
        className={`absolute px-4 top-0 left-0 w-auto h-auto transition-opacity duration-1000 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          minWidth: "100%",
          minHeight: "100%",
          // objectFit: "none"
        }}
        priority
      />
      
      <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${
        loaded ? 'opacity-100' : 'opacity-0 translate-y-4'
      }`}>
        <h1 className="text-6xl md:text-7xl font-extrabold text-white text-center font-serif tracking-wide px-4 text-shadow-lg cursor-none">
          "Sé tu mejor versión"
        </h1>
        <Link 
  href="/formularioContacto"
  className="absolute mt-[250px] bg-black text-white px-4 py-6 rounded-sm hover:bg-gray-500 cursor-pointer transition-colors duration-200"
>
  Únete a la familia.
</Link>
      </div>
   </div>
    <div className="bg-black w-screen h-[600px] flex">
  {/* Texto (1/3) - Se mantiene igual */}
  <div className="w-1/3 h-full flex items-center justify-center px-4 text-center">
    <p className="text-white font-serif sm:text-[24px] md:text-[26px] lg:text-[30px] cursor-none">
      En Colosus estamos comprometidos con ayudarte a alcanzar tu mayor potencial.
    </p>
  </div>

  {/* Contenedor de Imagen (2/3) - Versión simplificada */}
  <div className="w-2/3 h-full relative overflow-y-hidden">
    <Image
      src="/discobolus.jpg"
      alt="Escultura Discóbolo"
      width={1000}
      height={1460}
      className="
      w-full h-full object-cover object-right mb-0"
    />
  </div>
</div>
    </div>
  );
}
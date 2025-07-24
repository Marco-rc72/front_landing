import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black text-white p-4">
      <div className="flex justify-center items-center w-full">
        <div className="flex space-x-6">
          {/* División con línea vertical */}
          <div className="flex items-center">
            <Link
              href="/sobre-nosotros"
              className="hover:text-white transition-all duration-200 hover:scale-105"
            >
              Sobre nosotros
            </Link>
            <span className="h-5 w-px bg-white mx-6"></span>
          </div>

          {/* División con línea vertical */}
          <div className="flex items-center">
            <Link
              href="/planes-precios"
              className="hover:text-white transition-all duration-200 hover:scale-105"
            >
              Planes y precios
            </Link>
            <span className="h-5 w-px bg-white mx-6"></span>
          </div>

          {/* Último item sin línea vertical al final */}
          <div>
            <Link
              href="/historias-exito"
              className="hover:text-white transition-all duration-200 hover:scale-105"
            >
              Historias de éxito
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
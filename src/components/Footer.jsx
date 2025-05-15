import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#5C9FB9] text-white mt-8">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">QuickRoom</h3>
            <p className="text-sm">
              La manera más fácil de encontrar el cuarto perfecto para tus necesidades.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-sm">
                <Mail size={16} className="mr-2" />
                <span>info@QuickRoom.com</span>
              </li>
              <li className="flex items-center text-sm">
                <Phone size={16} className="mr-2" />
                <span>+52 (123) 456 7890</span>
              </li>
              <li className="flex items-center text-sm">
                <MapPin size={16} className="mr-2" />
                <span>Ciudad de México, México</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:underline">Términos y Condiciones</a></li>
              <li><a href="#" className="hover:underline">Política de Privacidad</a></li>
              <li><a href="#" className="hover:underline">Ayuda</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#9FD1E5] mt-6 pt-4 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Quickroom. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

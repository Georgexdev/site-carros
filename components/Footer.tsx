import { MapPin, Phone, MessageCircle, Mail } from "lucide-react";

export default function Footer() {
    return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-0">
        <div className="h-72 md:h-auto">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3808.0!2d-38.5!3d-12.97!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU4JzEyLjAiUyAzOMKwMzAnMDAuMCJX!5e0!3m2!1spt-BR!2sbr!4v1600000000000"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div className="p-8">
          <h3 className="text-xl font-bold mb-4">Concessionária Teste</h3>

          <div className="space-y-3 text-sm text-gray-300">
            <p className="flex items-start gap-2">
              <MapPin size={18} className="flex-shrink-0 mt-0.5" />
              Avenida Exemplo, 1000 - Bairro Modelo - Salvador/BA - CEP 40000-000
            </p>

            <a href="tel:5571999999999" className="flex items-center gap-2 hover:text-white">
              <Phone size={18} />
              (71) 99999-9999
            </a>

            
              <a href="https://wa.me/5571999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-white"
            >
              <MessageCircle size={18} />
              (71) 99999-9999
            </a>

            <a href="mailto:contato@concessionariateste.com.br" className="flex items-center gap-2 hover:text-white">
              <Mail size={18} />
              contato@concessionariateste.com.br
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Concessionária Teste. Todos os direitos reservados.
      </div>
    </footer >
  );
}
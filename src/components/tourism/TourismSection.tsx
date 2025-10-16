
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Coins, Globe } from 'lucide-react';
import CabinCard from './CabinCard';
import { useLanguage } from '@/contexts/LanguageContext';

const TourismSection: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {t('tourism.title')}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t('tourism.subtitle')}
        </p>
      </div>

      {/* Benefits Banner */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Coins className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-green-700">{t('tourism.payment')}</p>
                <p className="text-sm text-green-600">{t('tourism.payment-desc')}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-blue-700">{t('tourism.affiliates')}</p>
                <p className="text-sm text-blue-600">{t('tourism.affiliates-desc')}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MapPin className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="font-semibold text-purple-700">{t('tourism.argentina')}</p>
                <p className="text-sm text-purple-600">{t('tourism.argentina-desc')}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Globe className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="font-semibold text-orange-700">{t('tourism.worldwide')}</p>
                <p className="text-sm text-orange-600">{t('tourism.worldwide-desc')}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Argentina Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <MapPin className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{t('tourism.destinations')}</h2>
            <p className="text-muted-foreground">{t('tourism.explore')}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CabinCard 
            id="1"
            name="Cabaña del Lago"
            location="Bariloche, Río Negro"
            image="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop"
            pricePerNight={150}
            tokenDiscount={25}
            capacity={6}
            amenities={['WiFi', 'Chimenea', 'Cocina completa', 'Vista al lago']}
            description="Hermosa cabaña con vista panorámica al Lago Nahuel Huapi"
          />
          
          <CabinCard 
            id="2"
            name="Refugio de Montaña"
            location="El Calafate, Santa Cruz"
            image="https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800&h=600&fit=crop"
            pricePerNight={200}
            tokenDiscount={30}
            capacity={4}
            amenities={['Calefacción', 'Cocina', 'Terraza', 'Vista glaciar']}
            description="Cabaña rústica ideal para explorar el Glaciar Perito Moreno"
          />
          
          <CabinCard 
            id="3"
            name="Casa de Campo"
            location="Villa General Belgrano, Córdoba"
            image="https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&h=600&fit=crop"
            pricePerNight={120}
            tokenDiscount={20}
            capacity={8}
            amenities={['Piscina', 'Parrilla', 'Jardín', 'WiFi']}
            description="Amplia casa de campo en el corazón de las sierras cordobesas"
          />
          
          <CabinCard 
            id="4"
            name="Cabaña Patagónica"
            location="Ushuaia, Tierra del Fuego"
            image="https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&h=600&fit=crop"
            pricePerNight={180}
            tokenDiscount={28}
            capacity={5}
            amenities={['Chimenea', 'Cocina', 'Deck', 'Vista canal']}
            description="Cabaña en el fin del mundo con vistas al Canal Beagle"
          />
          
          <CabinCard 
            id="5"
            name="Lodge de Selva"
            location="Puerto Iguazú, Misiones"
            image="https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=800&h=600&fit=crop"
            pricePerNight={140}
            tokenDiscount={22}
            capacity={4}
            amenities={['A/C', 'Mosquiteros', 'Terraza', 'Vista selva']}
            description="Lodge ecológico cerca de las Cataratas del Iguazú"
          />
          
          <CabinCard 
            id="6"
            name="Cabaña de Montaña"
            location="San Martín de los Andes, Neuquén"
            image="https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&h=600&fit=crop"
            pricePerNight={160}
            tokenDiscount={24}
            capacity={6}
            amenities={['Chimenea', 'Cocina', 'Deck', 'Vista montañas']}
            description="Cabaña acogedora rodeada de bosques y montañas"
          />
        </div>
      </div>

      {/* International Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Globe className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{t('tourism.international')}</h2>
            <p className="text-muted-foreground">{t('tourism.discover')}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CabinCard 
            id="7"
            name="Alpine Chalet"
            location="Interlaken, Suiza"
            image="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop"
            pricePerNight={350}
            tokenDiscount={20}
            capacity={8}
            amenities={['WiFi', 'Chimenea', 'Sauna', 'Vista Alpes']}
            description="Chalet tradicional suizo con vistas espectaculares a los Alpes"
          />
          
          <CabinCard 
            id="8"
            name="Beach Villa"
            location="Tulum, México"
            image="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop"
            pricePerNight={280}
            tokenDiscount={25}
            capacity={6}
            amenities={['Piscina', 'Playa privada', 'A/C', 'Terraza']}
            description="Villa frente al mar Caribe con acceso privado a la playa"
          />
          
          <CabinCard 
            id="9"
            name="Mountain Lodge"
            location="Banff, Canadá"
            image="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop"
            pricePerNight={320}
            tokenDiscount={22}
            capacity={10}
            amenities={['Chimenea', 'Jacuzzi', 'Cocina', 'Vista montañas']}
            description="Lodge rústico en las Montañas Rocosas canadienses"
          />
          
          <CabinCard 
            id="10"
            name="Safari Lodge"
            location="Kruger, Sudáfrica"
            image="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&h=600&fit=crop"
            pricePerNight={400}
            tokenDiscount={30}
            capacity={4}
            amenities={['Safari incluido', 'A/C', 'Terraza', 'Vista sabana']}
            description="Lodge de lujo en el corazón de la reserva natural"
          />
          
          <CabinCard 
            id="11"
            name="Tropical Bungalow"
            location="Bora Bora, Polinesia"
            image="https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&h=600&fit=crop"
            pricePerNight={500}
            tokenDiscount={35}
            capacity={2}
            amenities={['Sobre el agua', 'Snorkel', 'A/C', 'Vista laguna']}
            description="Bungalow sobre el agua en una de las lagunas más hermosas del mundo"
          />
          
          <CabinCard 
            id="12"
            name="Desert Camp"
            location="Wadi Rum, Jordania"
            image="https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&h=600&fit=crop"
            pricePerNight={250}
            tokenDiscount={28}
            capacity={4}
            amenities={['Tienda glamping', 'Tour desierto', 'Cena beduina', 'Stargazing']}
            description="Experiencia única de glamping en el desierto de Wadi Rum"
          />
        </div>
      </div>
    </div>
  );
};

export default TourismSection;

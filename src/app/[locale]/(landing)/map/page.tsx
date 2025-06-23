import MapClient from "./_components/map-client";

interface MapPageProps {
  params: {
    lng: string;
  };
}

const MapPage = ({ params }: MapPageProps) => {
  return (
    <div className="h-[calc(100vh+64px)] w-full relative -mt-16">
      <MapClient params={params} />
    </div>
  );
};

export default MapPage;

interface SatelliteImageProps {
  image: string;
}

export default function SatelliteImage({ image }: SatelliteImageProps) {
  return (
    <img
      className="satellite-image"
      src={image}
      alt="Satellietfoto"
    />
  );
}
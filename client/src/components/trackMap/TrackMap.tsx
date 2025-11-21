import { Suspense, useEffect, useState } from 'react';
import { TrackMapProps } from './TrackMapProps.interface';
import { AxiosInstance, AxiosResponse } from 'axios';
import { useAuth } from 'react-oidc-context'
import { MapContainer, TileLayer } from 'react-leaflet';
import ReactLeafletKml from 'react-leaflet-kml';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css';
import './TrackMap.css';
import 'leaflet/dist/leaflet.css';
import httpClient from '../../httpClient/httpClient'

const TrackMap = ({ height, logId, tracks }: TrackMapProps) => {
  const [kmls, setKmls] = useState<any[]>([])
  const auth = useAuth();
  
  useEffect(() => {
    const getTracks = async () => {
      const convertedTracks: any[] = []

      for (const track of tracks) {
        const trackUrlSplit = track.url.split('/')
        const filename = trackUrlSplit[trackUrlSplit.length - 1];
        const response: AxiosResponse = await httpClient.get(
          `api/tracks/${logId}/${filename}`
        );
        const kml = new DOMParser().parseFromString(response.data, 'text/xml')
         
        convertedTracks.push(kml);
      }

      setKmls(convertedTracks)
    }

    getTracks();
  }, [])

  return (
    <MapContainer 
      center={[45.14489, -93.21019]} 
      scrollWheelZoom={false}
      style={{ height: height, width: '100%' }}
      zoom={8}
    >
      <Suspense>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {kmls.length > 0 && kmls.map((kml) => (
          <ReactLeafletKml kml={kml} />
        ))}
      </Suspense>
    </MapContainer>
  );
}

export default TrackMap;
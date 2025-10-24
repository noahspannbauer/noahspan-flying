import { useEffect, useState } from 'react';
import { LogTrackMapsProps } from './LogTrackMapsProps.interface';
import { AxiosInstance, AxiosResponse } from 'axios';
import { useAuth } from 'react-oidc-context'
import { MapContainer, TileLayer } from 'react-leaflet';
import ReactLeafletKml from 'react-leaflet-kml';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css';
import './LogTrackMaps.css';
import 'leaflet/dist/leaflet.css';
import httpClient from '../../httpClient/httpClient'

const LogTrackMaps = ({ logId, tracks }: LogTrackMapsProps) => {
  const [kmls, setKmls] = useState<any[]>([])
  const auth = useAuth()
  
  useEffect(() => {
    console.log(tracks)
    const getTracks = async () => {
      const convertedTracks: any[] = []

      for (const track of tracks) {
        const trackUrlSplit = track.url.split('/')
        const filename = trackUrlSplit[trackUrlSplit.length - 1];
        const response: AxiosResponse = await httpClient.get(
          `api/tracks/${logId}/${filename}`,
          {
            headers: {
              Authorization: auth.user?.access_token
            }
          }
        );
        const kml = new DOMParser().parseFromString(response.data, 'text/xml')
         
        convertedTracks.push(kml);
      }

      setKmls(convertedTracks)
    }

    getTracks();
  }, [tracks])

  return (
    <MapContainer 
      center={[45.14489, -93.21019]} 
      scrollWheelZoom={false}
      style={{ height: '500px', width: '100%' }}
      zoom={8}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {kmls.length > 0 && kmls.map((kml) => (
        <ReactLeafletKml kml={kml} />
      ))}
    </MapContainer>
  );
}

export default LogTrackMaps;
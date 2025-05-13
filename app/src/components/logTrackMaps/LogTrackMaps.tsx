import { useEffect, useState } from 'react';
import { LogTrackMapsProps } from './LogTrackMapsProps.interface';
import { useHttpClient } from '../../hooks/httpClient/UseHttpClient';
import { AxiosInstance, AxiosResponse } from 'axios';
import { useAccessToken } from '../../hooks/accessToken/UseAcessToken';
import { useIsAuthenticated } from '@azure/msal-react';
import { MapContainer, TileLayer } from 'react-leaflet';
import ReactLeafletKml from 'react-leaflet-kml';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css';
import './LogTrackMaps.css';
import 'leaflet/dist/leaflet.css';

const LogTrackMaps = ({ rowKey, trackUrls }: LogTrackMapsProps) => {
  const [tracks, setTracks] = useState<any[]>([])
  const httpClient: AxiosInstance = useHttpClient();
  const { getAccessToken } = useAccessToken();
  const isAuthenticated = useIsAuthenticated();
  
  useEffect(() => {
    const getTracks = async () => {
      const convertedTracks: any[] = []

      for (const trackUrl of trackUrls) {
        const trackUrlSplit = trackUrl.split('/')
        const filename = trackUrlSplit[trackUrlSplit.length - 1];
        const config = isAuthenticated
          ? { headers: { Authorization: await getAccessToken() } }
          : {};
        const response: AxiosResponse = await httpClient.get(
          `api/logs/log/${rowKey}/track?fileName=${filename}`,
          config
        );
        const kml = new DOMParser().parseFromString(response.data, 'text/xml')
         
        convertedTracks.push(kml);
      }

      setTracks(convertedTracks)
    }

    getTracks();
  }, [trackUrls])

  return (
    <>
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
        {tracks.length > 0 && tracks.map((track) => (
          <ReactLeafletKml kml={track} />
        ))}
      </MapContainer>
    </>
  );
}

export default LogTrackMaps;
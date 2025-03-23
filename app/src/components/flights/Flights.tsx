import { Box, Container } from "@noahspan/noahspan-components";
import LogbookCard from "../logbookCard/LogbookCard";
import { useEffect, useState } from "react";
import { useLogs } from "../../hooks/logs/UseLogs";
import { ILogbookEntry } from "../logbook/ILogbookEntry";

const Flights = () => {
  const [flights, setFlights] = useState<ILogbookEntry[]>([])
  const { logs } = useLogs();

  useEffect(() => {
    const flights: ILogbookEntry[] | undefined = logs?.filter((log: ILogbookEntry) => {
      if (log.tracks && JSON.parse(log.tracks).length > 0) {
        return log;
      }
    })

    if (flights && flights.length > 0) {
      setFlights(flights)
    }
  }, [logs])
  
  return (
    <Container>
      <Box sx={{ margin: '20px' }}>
        <LogbookCard logs={flights} mode='flights' />
      </Box>
    </Container>
  )
}

export default Flights;
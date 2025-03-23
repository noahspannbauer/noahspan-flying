import { Box, Container, Grid, Spinner } from "@noahspan/noahspan-components";
import LogbookCard from "../logbookCard/LogbookCard";
import { useEffect, useState } from "react";
import { useLogs } from "../../hooks/logs/UseLogs";
import { ILogbookEntry } from "../logbook/ILogbookEntry";

const Flights = () => {
  const [flights, setFlights] = useState<ILogbookEntry[]>([]);
  const { logs, isLoading } = useLogs();

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
        <Grid container spacing={2}>
          {isLoading &&
            <>
              <Grid display="flex" justifyContent="center" size={12}>
                <Spinner />
              </Grid>
              <Grid display="flex" justifyContent="center" size={12}>
                Loading...
              </Grid>
            </>
          }
          {!isLoading &&
            <Grid size={12}>
              <LogbookCard logs={flights} mode='flights' />
            </Grid>
          }
        </Grid>
      </Box>
    </Container>
  )
}

export default Flights;
import { Box, Card, CardContent, Container, Grid, Skeleton, Spinner, Stack, theme, Typography, useMediaQuery } from "@noahspan/noahspan-components";
import LogbookCard from "../logbookCard/LogbookCard";
import { useEffect, useState } from "react";
import { useLogs } from "../../hooks/logs/UseLogs";
import { ILogbookEntry } from "../logbook/ILogbookEntry";

const Flights = () => {
  const [flights, setFlights] = useState<ILogbookEntry[]>([]);
  const { logs, isLoading } = useLogs();
  const isMedium = useMediaQuery(theme.breakpoints.up('md'));

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
          <Grid size={isMedium ? 11 : 6}>
            <Typography variant="h4">Flights</Typography>
          </Grid>
          {!isLoading &&
            <Grid size={12}>
              <LogbookCard logs={flights} mode='flights' />
            </Grid>
          }
          {isLoading && [...Array(6)].map((_element, index) => {
            return (
              <Grid display='flex' justifyContent='center' size={12}>
                <Card
                  key={index}
                  sx={{
                    width: '100%'
                  }}
                >
                  <CardContent>
                    <Grid container>
                      <Grid size={12}>
                        <Skeleton height={60} width={200} />
                        <Skeleton height={30} width={200} />
                      </Grid>
                      <Grid size={12}>
                        <Skeleton height={300} />
                      </Grid>
                      <Grid size={12}>
                        {[...Array(4)].map((_element, index) => {
                          return (
                            <>
                              <Skeleton height={20} width={300} />
                              <Skeleton height={40} width={300} />
                            </>
                          )
                        })}
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            )
          })}
        </Grid>
      </Box>
    </Container>
  )
}

export default Flights;
import { Card, CardContent, CardHeader, Grid, Typography } from "@noahspan/noahspan-components"
import { PilotCardProps } from "./PilotCardProps.interface"
import ActionMenu from "../actionMenu/ActionMenu"

const PilotCard = ({ pilots, onDelete, onOpenCloseForm }: PilotCardProps) => {
  return (
    <Grid container spacing={2}>
      {pilots.map((pilot) => {
        return (
          <Grid size={12}>
            <Card key={pilot.rowKey}>
              <CardHeader
                action={<ActionMenu id={pilot.rowKey} onDelete={onDelete} onOpenCloseForm={onOpenCloseForm} />}
                title={pilot.name}
                slotProps={{
                  title: {
                    fontSize: '24px',
                  }
                }}
              />
            </Card>
          </Grid>
        )
      })}
    </Grid>
  )
}

export default PilotCard;
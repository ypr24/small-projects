import React from 'react'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'

const Place = (props) => {

    const { detail, onDelete } = props
        
    return (
        <div className="place">
            <Grid container spacing={2}>
                <Grid item xs={12} md={5}>
                    <div className="place-heading">
                        <Typography variant="h4" component="h2">
                            {detail.name}
                        </Typography>
                        <IconButton aria-label={`Delete ${detail.name}`} onClick={onDelete}>
                            <DeleteIcon fontSize="medium" />
                        </IconButton>
                    </div>
                    <Typography variant="subtitle1">
                        {detail.address} 
                    </Typography>
                    <br/>
                    <img className="place-image" src={detail.image} alt={detail.name} />
                </Grid>
                <Grid item xs={12} md={7}>
                    <Typography variant="body1">
                        {detail.description}
                    </Typography>
                </Grid>
            </Grid>
        </div>
    )
}

export default Place

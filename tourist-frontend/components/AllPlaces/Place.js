import React,{useEffect, useState} from 'react'
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import axios from 'axios'

const Place = (props) => {

    const detail = props.detail
        
    return (
        <div style={{ marginTop:40, marginBottom:60}}>
            <Grid style={{padding:10}} container spacing={2}>
                <Grid item lg={5} >
                    <div style={{display:'flex'}}>
                        <Typography variant="h4">
                            {detail.name}
                        </Typography>
                        <div style={{flexGrow:1}}></div>
                        <IconButton  aria-label="delete">
                            <DeleteIcon onClick={()=>{props.onDelete()}} fontSize="medium" />
                        </IconButton>
                    </div>
                    <Typography variant="subtitle1">
                        {detail.address} 
                    </Typography>
                    <br/>
                    <img src={detail.image} height={250} alt=""/>
                </Grid>
                <Grid item lg={7}>
                    <Typography style={{margin:20}} variant="subtitle1">
                        {detail.description}
                    </Typography>
                </Grid>
            </Grid>
        </div>
    )
}

export default Place

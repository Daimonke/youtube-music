import { CircularProgress, Typography } from '@mui/material'
import React from 'react'

type Props = {}

const NoPlaylistBox = (props: Props) => {
    return (
        <div style={{ ...styles.container, flexDirection: 'column' }}>
            <Typography textAlign={'center'} sx={styles.title} variant='h4'>Add your first playlist!</Typography>
            <CircularProgress />
        </div>
    )
}

const styles = {
    container: {
        height: '50vh',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '0px 0px 10px rgba(0,0,0,0.1)'
    },
    title: {
        mb: 2,
        textAlign: 'center',
    }
}

export default NoPlaylistBox
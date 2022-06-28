import { Backdrop, CircularProgress } from '@mui/material'
import React from 'react'

type Props = {
    loading: boolean
}

const Loading = ({ loading }: Props) => {
    return (
        <>
            <Backdrop
                sx={{ color: '#fff', zIndex: 1, backgroundColor: 'black' }}
                open={loading}
                transitionDuration={0}
                style={{ display: loading ? 'flex' : 'none' }}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    )
}

export default Loading
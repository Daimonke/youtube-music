import { Backdrop, CircularProgress } from '@mui/material'
import React from 'react'

type Props = {
    loading: boolean
}

const Loading = ({ loading }: Props) => {
    return (
        <>
            <Backdrop
                sx={{ color: '#fff', zIndex: 0, backgroundColor: 'black' }}
                open={loading}
                transitionDuration={0}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    )
}

export default Loading
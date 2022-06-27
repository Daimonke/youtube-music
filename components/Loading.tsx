import { Backdrop, CircularProgress } from '@mui/material'
import React from 'react'

type Props = {
    loading: boolean
}

const Loading = ({ loading }: Props) => {
    return (
        <>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: 'black' }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    )
}

export default Loading
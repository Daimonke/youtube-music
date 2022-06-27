import { Typography } from '@mui/material'
import React from 'react'
import arrow from '../public/arrow.svg';
import { motion } from 'framer-motion';

import Image from 'next/image';

type Props = {}

const NoPlaylistBox = (props: Props) => {
    return (
        <div style={{ ...styles.container, flexDirection: 'column' }}>
            <Image alt='arrowUp' className='arrow' src={arrow} height={300} width={100} />
            <Typography textAlign={'center'} sx={styles.title} variant='h4'>Add your first playlist!</Typography>
        </div>
    )
}

const styles = {
    container: {
        height: '50vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0px 0px 10px rgba(255,255,255,0.4)',
        borderRadius: '5px',
    },
    title: {
        color: 'lightgray',
        mb: 2,
        mt: 2,
        textAlign: 'center',
    },
}

export default NoPlaylistBox
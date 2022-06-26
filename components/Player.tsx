import { Container } from '@mui/material';
import dynamic from 'next/dynamic';
import React from 'react'
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

type Props = {}

const Player = (props: Props) => {
    return (
        <Container disableGutters sx={styles.container}>
            <ReactPlayer
                controls
                url='https://www.youtube.com/watch?v=15gGZQNlDVo&list=PL4GgJODQxydGVmSyYDn_zF4OS6w4Lw2p8&index=2'
                playing={true}
                width='100%'
            />
            <Container disableGutters>
                <h2>Songs</h2>
            </Container>
        </Container>
    )
}

const styles = {
    container: {
        mt: 2,
        display: 'flex',
        justifyContent: 'space-between',
        gap: 2,

    }
}

export default Player
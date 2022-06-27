import { Container } from '@mui/material';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import React from 'react'
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

type Props = {
    songs: any[]
}

const Player = ({ songs }: Props) => {

    return (
        <Container disableGutters sx={styles.container}>
            <ReactPlayer
                controls
                url='https://www.youtube.com/watch?v=15gGZQNlDVo&list=PL4GgJODQxydGVmSyYDn_zF4OS6w4Lw2p8&index=2'
                playing={true}
                width='100%'
            />
            <Container disableGutters sx={styles.songsContainer}>
                {songs.map((song, index) => (
                    <Container disableGutters sx={styles.songCard} key={index}>
                        <div style={{ position: 'relative', height: '100%', width: 200 }}>
                            <Image src={song.snippet?.thumbnails?.high?.url}
                                alt={song.snippet.title}
                                layout="fixed"
                                width={200}
                                height={150}
                            />
                        </div>
                        <p style={{ wordBreak: 'break-word' }}>{song.snippet?.title}</p>
                    </Container>
                ))}
            </Container>
        </Container>
    )
}

const styles = {
    container: {
        mt: 2,
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2,
    },
    songsContainer: {
        overflow: 'scroll',
        height: { xs: '50vh', md: '80vh' },
    },
    songCard: {
        display: 'flex',
        justifyContent: 'flex-start',
        gap: 2,
        width: '100%',
        borderRadius: '5px',
        boxShadow: '0px 0px 10px rgba(0,0,0,0.4)',
        backgroundColor: 'rgb(238, 238, 238)',
        mb: 2,
        cursor: 'pointer',
        '&:hover': {
            boxShadow: '0px 0px 10px rgba(0,0,0,0.7)',
            backgroundColor: 'rgb(222, 222, 222)',
        },
    },
}

export default Player
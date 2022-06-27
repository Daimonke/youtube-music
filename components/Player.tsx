import { CircularProgress, Container, Typography } from '@mui/material';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import NoPlaylistBox from './NoPlaylistBox';
const ReactPlayer = dynamic(() => import("react-player/youtube"), { ssr: false });

type Props = {
    songs: any[]
}

const Player = ({ songs }: Props) => {
    const [currentSong, setCurrentSong] = useState('');
    const [currentUrl, setCurrentUrl] = useState('');

    const handleSong = (song: any, index: number) => {
        setCurrentSong(song);
        setCurrentUrl(getSongUrl(song));
    }

    const getSongUrl = (song: any) => {
        if (!song) return '';
        return `https://www.youtube.com/watch?v=${song.snippet.resourceId.videoId}`
    }

    useEffect(() => {
        if (songs.length > 0) {
            setCurrentSong(songs[0]);
            setCurrentUrl(getSongUrl(songs[0]));
        }
    }
        , [songs]);


    return (
        <Container disableGutters sx={styles.container}>
            {songs.length === 0 ? <NoPlaylistBox /> :
                <>
                    <ReactPlayer
                        fallback={<CircularProgress />}
                        controls
                        url={currentUrl}
                        width='100%'
                        playing={true}
                        volume={0.5}
                        onReady={() => {
                            console.log('onReady')
                        }
                        }
                    />
                    <Container disableGutters sx={styles.songsContainer}>
                        {songs.map((song, index) => (
                            <Container disableGutters sx={styles.songCard} key={index} onClick={() => handleSong(song, index)}>
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
                </>
            }
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
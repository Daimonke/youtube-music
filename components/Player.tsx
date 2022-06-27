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
                        height='40vh'
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
                                <Image src={song.snippet?.thumbnails?.high?.url}
                                    alt={song.snippet.title}
                                    layout="fixed"
                                    width={250}
                                    height={120}
                                    style={{ borderTopLeftRadius: 5, borderBottomLeftRadius: 5 }}
                                />
                                <p style={{ wordBreak: 'break-word', textAlign: 'left', width: '100%', padding: 5 }}>{song.snippet?.title}</p>
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
        mt: { xs: 2, md: 5 },
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2,
        overflow: 'scroll',
    },
    songsContainer: {
        overflow: 'scroll',
        height: { xs: '45vh', md: '40vh' },
    },
    songCard: {
        display: 'flex',
        justifyContent: 'flex-start',
        gap: 2,
        width: '100%',
        borderRadius: '5px',
        boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px',
        mb: 2,
        cursor: 'pointer',
        '&:hover': {
            boxShadow: '0px 0px 10px rgba(0,0,0,0.7)',
            backgroundColor: 'rgb(222, 222, 222)',
        },
    },
}

export default Player
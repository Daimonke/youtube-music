import { Button, CircularProgress, Container, Typography } from '@mui/material';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import NoPlaylistBox from './NoPlaylistBox';
const ReactPlayer = dynamic(() => import("react-player/youtube"), { ssr: false });

type Props = {
    songs: any[]
    nextToken: string | null
    currentPlaylistId: string | null
    setSongs: (songs: any[]) => void
    setNextToken: (token: string | null) => void
}

const Player = ({ songs, setSongs, setNextToken, nextToken, currentPlaylistId }: Props) => {
    const [currentSong, setCurrentSong] = useState(0);
    const [currentUrl, setCurrentUrl] = useState('');

    const handleSong = (song: any, index: number) => {
        setCurrentSong(index);
        setCurrentUrl(getSongUrl(song));
    }

    const getSongUrl = (song: any) => {
        if (!song) return '';
        return `https://www.youtube.com/watch?v=${song.snippet.resourceId.videoId}`
    }

    const handleLoadMore = () => {
        if (!nextToken) return;
        fetch(`/api/moreSongs/?playlistId=${currentPlaylistId}&pageToken=${nextToken}`)
            .then(res => res.json())
            .then(res => {
                setSongs([...songs, ...res.items]);
                setNextToken(res.nextPageToken);
            }
            )
            .catch(() => {
                setNextToken(null);
            }
            )

    }

    const handleScroll = (e: any) => {
        if (e.target.scrollTop + e.target.clientHeight >= e.target.scrollHeight) handleLoadMore();
    }

    useEffect(() => {
        if (songs?.length > 0) {
            setCurrentSong(0);
            setCurrentUrl(getSongUrl(songs[0]));
        }
    }
        , [songs]);


    return (
        <Container disableGutters sx={styles.container}>
            {songs?.length === 0 ? <NoPlaylistBox /> :
                <>
                    <ReactPlayer
                        fallback={<CircularProgress />}
                        controls
                        url={currentUrl}
                        width='100%'
                        height='40vh'
                        playing={true}
                        light
                        onEnded={() => {
                            setCurrentSong(currentSong + 1);
                            setCurrentUrl(getSongUrl(songs[currentSong + 1]));
                        }}
                    />
                    <Container disableGutters sx={styles.songsContainer} onScroll={handleScroll}>
                        {songs?.map((song, index) => (
                            <Container disableGutters sx={[styles.songCard, index === currentSong ? styles.active : null]} key={index} className='background' onClick={() => handleSong(song, index)}>
                                {song?.snippet?.thumbnails?.high?.url ?
                                    <Image src={song.snippet.thumbnails.high.url}
                                        alt={song.snippet.title}
                                        layout="fixed"
                                        width={200}
                                        height={90}
                                        style={{ borderTopLeftRadius: 5, borderBottomLeftRadius: 5 }}
                                    /> : null}
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
        alignItems: 'space-between',
        flexDirection: { xs: 'column', md: 'row' },
        gap: { xs: 0, md: 2 },
    },
    songsContainer: {
        mt: { xs: 2, md: 0 },
        overflow: 'scroll',
        height: { xs: 'calc(60vh - 140px)', md: '40vh' },
    },
    songCard: {
        color: 'white',
        display: 'flex',
        justifyContent: 'flex-start',
        gap: 2,
        width: '100%',
        borderRadius: '5px',
        backgroundColor: 'rgba(157, 157, 157, 0.25)',
        mb: 1.2,
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.3)'
        },
    },
    active: {
        backgroundColor: 'rgba(20, 162, 0, 0.4)',
        '&:hover': {
            backgroundColor: 'rgba(20, 162, 0, 0.6)'
        },
    }
}

export default Player
import { CircularProgress, Container, Typography } from '@mui/material';
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
    loading: boolean
}

const Player = ({ songs, setSongs, setNextToken, nextToken, currentPlaylistId, loading }: Props) => {
    const [currentSong, setCurrentSong] = useState(0);
    const [currentUrl, setCurrentUrl] = useState('');
    const [canUpdate, setCanUpdate] = useState(true);

    const handleSong = (song: any, index: number) => {
        setCurrentSong(index);
        setCurrentUrl(getSongUrl(song));
    }

    const getSongUrl = (song: any) => {
        if (!song) return '';
        return `https://www.youtube.com/watch?v=${song.snippet.resourceId.videoId}`
    }

    const handleLoadMore = async () => {
        if (!nextToken) return setCanUpdate(true);
        fetch(`/api/moreSongs/?playlistId=${currentPlaylistId}&pageToken=${nextToken}`)
            .then(res => res.json())
            .then(res => {
                console.log('Loading')
                setSongs([
                    ...songs,
                    ...res.items.filter((item: { snippet: { title: string; }; }) => item.snippet.title !== 'Deleted video')
                ]);
                setNextToken(res.nextPageToken);
            }
            )
            .catch(() => {
                setNextToken(null);
            }
            )
            .finally(() => setCanUpdate(true))
    }

    const handleScroll = (e: React.UIEvent) => {
        if (!canUpdate) return;
        if (e.currentTarget.scrollTop + e.currentTarget.clientHeight >= e.currentTarget.scrollHeight - 200 && canUpdate) {
            setCanUpdate(false)
            handleLoadMore();
        }
    }

    useEffect(() => {
        if (songs?.length > 0 && currentSong === 0) {
            setCurrentUrl(getSongUrl(songs[0]));
        }
    }
        , [currentSong, songs]);

    return (
        <Container disableGutters sx={styles.container}>
            {songs?.length === 0 ? <NoPlaylistBox /> :
                <>
                    <Container disableGutters sx={{ height: { xs: '30vh', md: '50vh' } }} >
                        <ReactPlayer
                            fallback={<CircularProgress />}
                            controls
                            url={currentUrl}
                            width='100%'
                            height='100%'
                            playing={true}
                            onEnded={() => {
                                setCurrentSong(currentSong + 1);
                                setCurrentUrl(getSongUrl(songs[currentSong + 1]));
                            }}
                        />
                    </Container>
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
                                <p style={{ wordBreak: 'break-word', textAlign: 'left', width: '100%', padding: '0 5px' }}>{song.snippet?.title}</p>
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
        overflowY: 'scroll',
        scrollBehavior: 'smooth',
        height: { xs: 'calc(70vh - 140px)', md: '50vh' },
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
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
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
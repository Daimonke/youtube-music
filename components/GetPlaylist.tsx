import { Button, Container, TextField } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import { motion } from "framer-motion"
import MenuNav from './MenuNav';


type Props = {
    setSongs: (songs: any[]) => void;
    open: boolean;
    setNextToken: (token: string | null) => void;
    setCurrentPlaylistId: (id: string | null) => void;
    handleOpen: () => void;
    setLoading: (loading: boolean) => void;
}

const GetPlaylist = ({ handleOpen, setSongs, open, setNextToken, setCurrentPlaylistId, setLoading }: Props) => {

    const [url, setUrl] = useState('');
    const [name, setName] = useState('');
    const [inputLabel, setInputLabel] = useState('Playlist URL')
    const [error, setError] = useState(false)
    const [alignment, setAlignment] = useState('Add');
    const [playlists, setPlaylists] = useState<any[]>([]);

    const handleTab = (
        event: React.MouseEvent<HTMLElement>,
        newAlignment: string,
    ) => {
        if (newAlignment === 'Add' || newAlignment === 'My') setAlignment(newAlignment);
    };

    const displayError = () => {
        setError(true)
        setInputLabel('Invalid playlist URL')
    }

    const getPlaylist = (url: string) => {
        if (!url || !url.includes('list=')) return displayError();
        const playlistId = url.split('list=')[1].split('&')[0];
        fetch(`/api/playlist/?playlistId=${playlistId}`)
            .then(res => res.json())
            .then(res => {
                setNextToken(res.nextPageToken)
                setCurrentPlaylistId(playlistId)
                setSongs(res.items)
                setError(false)
                setInputLabel('Playlist URL')
                const playlists = JSON.parse(localStorage.getItem('playlists') || '[]')
                setPlaylists(playlists)
                if (playlists.some((playlist: { url: string; }) => playlist.url === url)) return;
                playlists.unshift({
                    name: name || 'Playlist',
                    url: url,
                    totalResults: res.pageInfo.totalResults,
                })
                localStorage.setItem('playlists', JSON.stringify(playlists))
            }
            )
            .then(() => {
                if (open) handleOpen()
            })
            .catch(() => {
                setError(true)
                setInputLabel('Invalid Playlist URL')
            })
    }

    useEffect(() => {
        setLoading(true)
        const playlists = JSON.parse(localStorage.getItem('playlists') || '[]')
        if (playlists.length > 0) {
            getPlaylist(playlists[0].url)
        }
        setLoading(false)
    }
        , [])


    return (
        <Container disableGutters sx={{ zIndex: 1 }}>
            <motion.div initial={{ height: 0 }}
                animate={{ overflow: 'hidden', height: open ? 'auto' : 0 }} >
                <Container disableGutters sx={styles.container}>
                    <MenuNav handleTab={handleTab} alignment={alignment} />
                    {alignment === 'Add' && (
                        <>
                            <TextField fullWidth label='Playlist name' variant="outlined" onChange={(e) => setName(e.target.value)} />
                            <TextField fullWidth label={inputLabel} variant="outlined" onChange={(e) => setUrl(e.target.value)} error={error} />
                            <Container disableGutters sx={styles.buttons}>
                                <Button variant='contained' color='error' sx={styles.button} onClick={handleOpen}>Close</Button>
                                <Button variant='contained' color='success' sx={styles.button} onClick={() => getPlaylist(url)}>Save</Button>
                            </Container>
                        </>
                    )}
                    {alignment === 'My' && (
                        <>
                            {playlists.length === 0 ?
                                <p style={{ textAlign: 'center' }}>No playlists yet..</p>
                                : null}
                            {playlists.map((playlist: {
                                totalResults: number; url: string; name: string;
                            }, index: number) => (
                                <Container disableGutters key={index} sx={styles.playlist} className='background'>
                                    <div>
                                        <p>{index + 1}. {playlist.name}</p>
                                        <p style={{ fontSize: '0.9em', color: 'gray' }}>{playlist.totalResults} songs</p>
                                    </div>
                                    <Button key={index} variant='text' color='primary' onClick={() => getPlaylist(playlist.url)}>Open</Button>
                                </Container>
                            ))}
                            <Button variant='contained' color='error' sx={styles.button} onClick={handleOpen}>Close</Button>
                        </>
                    )}
                </Container>
            </motion.div >
        </Container >
    )
}

const styles = {
    button: {
        display: 'block',
        margin: '0 auto',
        width: '20%',
        p: 1,
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        marginTop: 2,
        padding: 2,
        overflow: 'hidden',
        borderRadius: '5px',
        backgroundColor: 'rgb(238, 238, 238)',
        boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)',
    },
    buttons: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2
    },
    playlist: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 2,
        p: 2,
        borderRadius: '5px',
        backgroundColor: 'rgba(157, 157, 157, 0.25)',
    }
}

export default GetPlaylist
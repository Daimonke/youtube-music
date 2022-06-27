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
}

const GetPlaylist = ({ handleOpen, setSongs, open, setNextToken, setCurrentPlaylistId }: Props) => {

    const [url, setUrl] = useState('');
    const [name, setName] = useState('');
    const [inputLabel, setInputLabel] = useState('Playlist URL')
    const [error, setError] = useState(false)
    const [alignment, setAlignment] = useState('Add');

    const handleTab = (
        event: React.MouseEvent<HTMLElement>,
        newAlignment: string,
    ) => {
        setAlignment(newAlignment);
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
                if (playlists.some((playlist: { url: string; }) => playlist.url === url)) return;
                playlists.unshift({
                    name: name || 'Playlist',
                    url: url,
                })
                localStorage.setItem('playlists', JSON.stringify(playlists))
                handleOpen()

            }
            )
            .catch(() => {
                setError(true)
                setInputLabel('Invalid Playlist URL')
            })
    }

    useEffect(() => {
        const playlists = JSON.parse(localStorage.getItem('playlists') || '[]')
        if (playlists.length > 0) {
            getPlaylist(playlists[0].url)
        }
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
                            <Container disableGutters sx={styles.buttons}>
                                <Button variant='contained' color='error' sx={styles.button} onClick={handleOpen}>Close</Button>
                            </Container>
                        </>
                    )}
                </Container>
            </motion.div>
        </Container>
    )
}

const styles = {
    button: {
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
    }
}

export default GetPlaylist
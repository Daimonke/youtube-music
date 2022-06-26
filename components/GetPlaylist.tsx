import { Button, Container, TextField } from '@mui/material'
import React, { useState } from 'react'
import { motion } from "framer-motion"
import { style } from '@mui/system';


type Props = {
    handleOpen: () => void;
    setSongs: (songs: any[]) => void;
    open: boolean;
}

const GetPlaylist = ({ handleOpen, setSongs, open }: Props) => {

    const [url, setUrl] = useState('')
    const [inputLabel, setInputLabel] = useState('Playlist URL')
    const [error, setError] = useState(false)

    const displayError = () => {
        setError(true)
        setInputLabel('Invalid playlist URL')
    }

    const getPlaylist = async () => {
        if (!url || !url.includes('list=')) return displayError();
        const playlistId = url.split('list=')[1].split('&')[0]
        await fetch(`https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=20&playlistId=${playlistId}&key=AIzaSyCxkr8mg3wTI8nvBBnr3ynOu-iHfb8YPgA`)
            .then(res => res.json())
            .then(res => {
                console.log(res.items)
                setSongs(res.items)
            }
            )
            .catch(() => {
                setError(true)
                setInputLabel('Invalid Playlist URL')
            })
    }

    return (
        <Container disableGutters>
            <motion.div initial={{ height: 0 }}
                animate={{ overflow: 'hidden', height: open ? 'auto' : 0 }} >
                <Container disableGutters sx={styles.container}>
                    <TextField fullWidth label={inputLabel} variant="outlined" onChange={(e) => setUrl(e.target.value)} error={error} />
                    <Button variant='contained' color='success' sx={styles.button} onClick={getPlaylist}>Get Playlist</Button>
                </Container>
            </motion.div>
        </Container>
    )
}

const styles = {
    button: {
        display: 'block',
        margin: '0 auto',
        width: '50%',
        mt: 2,
        p: 2,
    },
    container: {
        marginTop: 2,
        padding: 2,
        overflow: 'hidden',
        borderRadius: '5px',
        backgroundColor: 'rgb(238, 238, 238)',
        boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)',
    }
}

export default GetPlaylist
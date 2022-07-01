import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { Container } from '@mui/material';
import GetPlaylist from './GetPlaylist';

type Props = {
    setSongs: (songs: any[]) => void
    songs: any[]
    setNextToken: (token: string | null) => void
    setCurrentPlaylistId: (id: string | null) => void
    setLoading: (loading: boolean) => void
}

export default function PlaylistMenu({ setSongs, songs, setNextToken, setCurrentPlaylistId, setLoading }: Props) {
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(!open);
    };

    return (
        <Container disableGutters sx={{ position: 'relative', pt: 2, height: '100%' }} >
            <Button variant='contained' color='primary' sx={styles.button} onClick={handleOpen}>Playlist Menu</Button>
            <GetPlaylist setLoading={setLoading} handleOpen={handleOpen} setSongs={setSongs} open={open} setNextToken={setNextToken} setCurrentPlaylistId={setCurrentPlaylistId} />
        </Container>
    );
}

const styles = {
    button: {
        display: 'block',
        margin: '0 auto',
        width: '60%',
    }
}
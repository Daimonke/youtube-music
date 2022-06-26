import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Container } from '@mui/material';
import GetPlaylist from './GetPlaylist';

type Props = {
    setSongs: (songs: any[]) => void
}

export default function PlaylistMenu({ setSongs }: Props) {
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(!open);
    };

    return (
        <Container disableGutters >
            <Button variant='contained' color='primary' sx={styles.button} onClick={handleOpen}>Playlist Menu</Button>
            <GetPlaylist handleOpen={handleOpen} setSongs={setSongs} open={open} />
        </Container>
    );
}

const styles = {
    button: {
        display: 'block',
        margin: '0 auto',
        width: '50%',
        mt: 2,
        p: 2
    }
}
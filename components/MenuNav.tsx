import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

type Props = {
    handleTab: (event: React.MouseEvent<HTMLElement>, newAlignment: string,) => void
    alignment: string
}

export default function MenuNav({ handleTab, alignment }: Props) {

    return (
        <ToggleButtonGroup
            color='primary'
            value={alignment}
            exclusive
            onChange={handleTab}
            sx={styles.container}
        >
            <ToggleButton sx={styles.button} value="Add">ADD NEW</ToggleButton>
            <ToggleButton sx={styles.button} value="My">MY PLAYLISTS</ToggleButton>
        </ToggleButtonGroup>
    );
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
    },
    button: {
        width: '100%',
    }
}

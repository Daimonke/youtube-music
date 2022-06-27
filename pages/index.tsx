import type { NextPage } from 'next'
import Head from 'next/head'
import React, { useState } from 'react';
import { Container } from '@mui/material';
import Player from '../components/Player';
import PlaylistMenu from '../components/PlaylistMenu';





const Home: NextPage = () => {
  const [songs, setSongs] = useState<any[]>([]);

  return (
    <Container sx={{ height: '100vh' }}>
      <Head>
        <title>Youtube playlist player</title>
        <meta name="description" content="Play your youtube playlist without any ads" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PlaylistMenu setSongs={setSongs} songs={songs} />
      <Player songs={songs} />
    </Container>
  )
}

export default Home


import type { NextPage } from 'next'
import Head from 'next/head'
import React, { useState } from 'react';
import { Container } from '@mui/material';
import Player from '../components/Player';
import PlaylistMenu from '../components/PlaylistMenu';
import Loading from '../components/Loading';





const Home: NextPage = () => {
  const [songs, setSongs] = useState<any[]>([]);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [currentPlaylistId, setCurrentPlaylistId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <Container >
      <Loading loading={loading} />
      <Head>
        <title>Youtube playlist player</title>
        <meta name="description" content="Play your youtube playlist without any ads" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PlaylistMenu setSongs={setSongs} songs={songs} setNextToken={setNextToken} setCurrentPlaylistId={setCurrentPlaylistId} setLoading={setLoading} />
      <Player songs={songs} setSongs={setSongs} setNextToken={setNextToken} nextToken={nextToken} currentPlaylistId={currentPlaylistId} />
    </Container>
  )
}

export default Home


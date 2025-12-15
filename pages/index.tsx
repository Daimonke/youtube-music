import type { NextPage } from "next";
import React, { useState } from "react";
import { Container } from "@mui/material";
import Player from "../components/Player";
import PlaylistMenu from "../components/PlaylistMenu";
import Loading from "../components/Loading";
import { motion } from "framer-motion";

const Home: NextPage = () => {
  const [songs, setSongs] = useState<any[]>([]);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [currentPlaylistId, setCurrentPlaylistId] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Container>
        <Loading loading={loading} />
        <PlaylistMenu
          setSongs={setSongs}
          songs={songs}
          setNextToken={setNextToken}
          setCurrentPlaylistId={setCurrentPlaylistId}
          setLoading={setLoading}
        />
        <Player
          songs={songs}
          setSongs={setSongs}
          setNextToken={setNextToken}
          nextToken={nextToken}
          currentPlaylistId={currentPlaylistId}
        />
      </Container>
    </motion.div>
  );
};

export default Home;

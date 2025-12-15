import { CircularProgress, Container } from "@mui/material";
import dynamic from "next/dynamic";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import NoPlaylistBox from "./NoPlaylistBox";

const ReactPlayer = dynamic(() => import("react-player/youtube"), {
  ssr: false,
});

type Props = {
  songs: any[];
  nextToken: string | null;
  currentPlaylistId: string | null;
  setSongs: (songs: any[]) => void;
  setNextToken: (token: string | null) => void;
};

const Player = ({
  songs,
  setSongs,
  setNextToken,
  nextToken,
  currentPlaylistId,
}: Props) => {
  const wakeLock = useRef<WakeLockSentinel | undefined>();
  const [currentSong, setCurrentSong] = useState(0);
  const [currentUrl, setCurrentUrl] = useState("");
  const [canUpdate, setCanUpdate] = useState(true);
  const songsContainerRef = useRef<HTMLDivElement>(null);
  const songRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const handleSong = (song: any, index: number) => {
    setCurrentSong(index);
    setCurrentUrl(getSongUrl(song));
  };

  const getSongUrl = (song: any) => {
    if (!song) return "";
    return `https://www.youtube.com/watch?v=${song.snippet.resourceId.videoId}`;
  };

  const handleLoadMore = async () => {
    if (!nextToken) return setCanUpdate(true);
    fetch(
      `/api/moreSongs/?playlistId=${currentPlaylistId}&pageToken=${nextToken}`
    )
      .then((res) => res.json())
      .then((res) => {
        setSongs([
          ...songs,
          ...res.items.filter(
            (item: { snippet: { title: string } }) =>
              item.snippet.title !== "Deleted video" &&
              item.snippet.title !== "Private video"
          ),
        ]);
        setNextToken(res.nextPageToken);
      })
      .catch(() => {
        setNextToken(null);
      })
      .finally(() => setCanUpdate(true));
  };

  const handleScroll = (e: React.UIEvent) => {
    if (!canUpdate) return;
    if (
      e.currentTarget.scrollTop + e.currentTarget.clientHeight >=
        e.currentTarget.scrollHeight - 200 &&
      canUpdate
    ) {
      setCanUpdate(false);
      handleLoadMore();
    }
  };

  const isElementVisible = (
    element: HTMLDivElement | null,
    container: HTMLDivElement | null
  ): boolean => {
    if (!element || !container) return false;

    // Use getBoundingClientRect for accurate positioning
    const containerRect = container.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    // Check if any part of the element is visible within the container's viewport
    // Element is visible if its bottom is below container's top AND its top is above container's bottom
    return (
      elementRect.bottom > containerRect.top &&
      elementRect.top < containerRect.bottom
    );
  };

  const scrollToNextSong = (nextIndex: number) => {
    const nextSongElement = songRefs.current.get(nextIndex);
    if (nextSongElement && songsContainerRef.current) {
      nextSongElement.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  };

  useEffect(() => {
    if (songs?.length > 0 && currentSong === 0) {
      setCurrentUrl(getSongUrl(songs[0]));
    }
  }, [currentSong, songs]);

  useEffect(() => {
    const requestWakeLock = async () => {
      try {
        wakeLock.current = await navigator.wakeLock?.request("screen");
      } catch (err) {
        return;
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        requestWakeLock();
      } else {
        wakeLock.current?.release();
      }
    };

    requestWakeLock();
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      wakeLock.current?.release();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return (
    <Container disableGutters sx={styles.container}>
      {songs?.length === 0 ? (
        <NoPlaylistBox />
      ) : (
        <>
          <Container disableGutters sx={{ height: { xs: "30vh", md: "50vh" } }}>
            <ReactPlayer
              fallback={<CircularProgress />}
              controls
              url={currentUrl}
              width="100%"
              height="100%"
              playing={true}
              stopOnUnmount={false}
              onEnded={() => {
                const nextIndex = currentSong + 1;
                if (nextIndex < songs.length) {
                  // Store current song index before state update
                  const currentIndex = currentSong;
                  const currentSongElement = songRefs.current.get(currentIndex);

                  setCurrentSong(nextIndex);
                  setCurrentUrl(getSongUrl(songs[nextIndex]));

                  // Check visibility after a brief delay to ensure DOM is stable
                  // Use requestAnimationFrame to ensure DOM is updated
                  requestAnimationFrame(() => {
                    const isCurrentVisible = isElementVisible(
                      currentSongElement || null,
                      songsContainerRef.current
                    );

                    // Only scroll if current song was visible
                    if (isCurrentVisible) {
                      scrollToNextSong(nextIndex);
                    }
                  });
                }
              }}
            />
          </Container>
          <Container
            disableGutters
            sx={styles.songsContainer}
            onScroll={handleScroll}
            ref={songsContainerRef}
          >
            {songs?.map((song, index) => (
              <Container
                disableGutters
                sx={[
                  styles.songCard,
                  getSongUrl(song) === currentUrl ? styles.active : null,
                ]}
                key={index}
                className="background noScrollbar"
                onClick={() => handleSong(song, index)}
                ref={(el) => {
                  if (el) {
                    songRefs.current.set(index, el);
                  } else {
                    songRefs.current.delete(index);
                  }
                }}
              >
                {song?.snippet?.thumbnails?.high?.url ? (
                  <Image
                    src={song.snippet.thumbnails.high.url}
                    alt={song.snippet.title}
                    layout="fixed"
                    width={200}
                    height={90}
                    style={{
                      borderTopLeftRadius: 5,
                      borderBottomLeftRadius: 5,
                    }}
                  />
                ) : null}
                <p
                  style={{
                    wordBreak: "break-word",
                    textAlign: "left",
                    width: "100%",
                    padding: "0 5px",
                  }}
                >
                  {song.snippet?.title}
                </p>
              </Container>
            ))}
          </Container>
        </>
      )}
    </Container>
  );
};

const styles = {
  container: {
    mt: { xs: 2, md: 5 },
    display: "flex",
    justifyContent: "space-between",
    alignItems: "space-between",
    flexDirection: { xs: "column", md: "row" },
    gap: { xs: 0, md: 2 },
  },
  songsContainer: {
    mt: { xs: 2, md: 0 },
    overflowY: "scroll",
    scrollBehavior: "smooth",
    height: { xs: "calc(70vh - 140px)", md: "50vh" },
    // hide scrollbar all browsers
    scrollBarWith: "none",
    msOverflowStyle: "none",
    "&::-webkit-scrollbar": {
      display: "none",
      width: 0,
      height: 0,
    },
  },
  songCard: {
    color: "white",
    display: "flex",
    justifyContent: "flex-start",
    gap: 2,
    width: "100%",
    borderRadius: "5px",
    backgroundColor: "rgba(157, 157, 157, 0.25)",
    mb: 1.2,
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.3)",
    },
  },
  active: {
    backgroundColor: "rgba(20, 162, 0, 0.4)",
    "&:hover": {
      backgroundColor: "rgba(20, 162, 0, 0.6)",
    },
  },
};

export default Player;

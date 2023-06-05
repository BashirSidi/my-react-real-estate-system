import {
  memo, useCallback, useEffect, useRef, useState,
} from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import PlayArrow from '@material-ui/icons/PlayArrow';
import CancelPresentationIcon from '@material-ui/icons/CancelPresentation';
import { useAllPrismicDocumentsByType } from '@prismicio/react';
import useTranslation from 'next-translate/useTranslation';
import ReactPlayer from 'react-player';

import usePageTranslation from 'hooks/usePageTranslation';
import { changeToPrismicLang } from 'utilities/prismic';
import { useStyles } from './styles';

const SizeEstimatorPlayer: React.FunctionComponent = () => {
  const classes = useStyles();
  const playerRef = useRef(null);
  const { lang } = useTranslation();
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [videoIndex, setVideoIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [videos] = useAllPrismicDocumentsByType('video', {
    lang: changeToPrismicLang(lang),
    orderings: ['document.first_publication_date'],
  });
  const { t } = usePageTranslation('search', 'SizeEstimatorPlayer');
  const streamUrls = videos?.map((vid) => ((vid?.data?.video_url) as any)?.url) ?? [];

  const playNextVideo = () => {
    if (videoIndex === streamUrls.length - 1) {
      setVideoIndex(0);
      setPlaying(false);
      return;
    }

    setVideoIndex((prev) => prev + 1);
  };

  useEffect(() => {
    const onFullscreen = () => {
      if (!document.fullscreenElement) {
        setPlaying(false);
        setFullscreen(false);
      }
    };

    document.addEventListener('fullscreenchange', onFullscreen);
    return () => document.removeEventListener(
      'fullscreenchange', onFullscreen,
    );
  }, []); // eslint-disable-line

  const openInFullScreen = useCallback(() => {
    const elem = document.querySelector('#videoPlayer');

    if (!document.fullscreenElement) {
      setFullscreen(true);
      setPlaying(true);

      elem?.requestFullscreen?.().catch((err) => {
        console.warn(`Fullscreen mode error: ${err.message}`); // eslint-disable-line
      });
    }
  }, []);

  const CloseFullscreen = useCallback(async () => {
    await document.exitFullscreen();
  }, []);

  const onEnded = () => playNextVideo();
  const onReady = () => {
    if (playerRef.current) {
      playerRef.current.handleClickPreview();
      setLoading(false);
    }
  };

  return Boolean(streamUrls.length) && (
    <Box className={classes.wrapper}>
      <Box className={classes.headerBox}>
        <Typography variant="h2" className={classes.header}>
          {t('h2')}
        </Typography>
      </Box>
      <Box id="videoPlayer" className={classes.playerWrapper} onClick={openInFullScreen}>
        <ReactPlayer
          playing={playing}
          ref={playerRef}
          className={classes.reactPlayer}
          url={streamUrls[videoIndex]}
          onReady={onReady}
          onEnded={onEnded}
          width="100%"
          height="100%"
          controls={fullscreen}
        />
        { !playing
          && (
            <Box className={classes.playerControls}>
              <Box className={classes.playerControlsButton}>
                {!loading ? (
                  !playing && <PlayArrow htmlColor="#FFF" />
                ) : <CircularProgress className={classes.loader} />}
              </Box>
            </Box>
          )}
        <Box className={classes.closeWrapper} onClick={CloseFullscreen}>
          {fullscreen && <CancelPresentationIcon htmlColor="#FFF" className={classes.closeIcon} />}
        </Box>
      </Box>
    </Box>
  );
};

export default memo(SizeEstimatorPlayer);

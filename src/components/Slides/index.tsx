import React from 'react';
import { useKeenSlider } from 'keen-slider/react';
import { makeStyles } from '@material-ui/core/';
import 'keen-slider/keen-slider.min.css';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  number_slide1: {
    background:
      'linear-gradient(128deg,rgba(64, 175, 255, 1) 0%,rgba(63, 97, 255, 1) 100%)',
  },
  navigation_wrapper: {
    position: 'relative',
  },
  dots: {
    display: 'flex',
    padding: '10px 0',
    justifyContent: 'center',
  },
  dot: {
    border: 'none',
    width: '10px',
    height: '10px',
    background: '#c5c5c5',
    borderRadius: '50%',
    margin: '0 5px',
    padding: '5px',
    cursor: 'pointer',
  },
  dot_focus: {
    outline: 'none',
  },
  dot_active: {
    background: '#000',
  },
  arrow: {
    width: '30px',
    height: '30px',
    position: 'absolute',
    transform: 'translateY(-50%)',
    WebkitTransform: 'translateY(-50%)',
    fill: '#fff',
    cursor: 'pointer',
    [theme.breakpoints.up('sm')]: {
      margin: '10% 0',
    },
    [theme.breakpoints.down('sm')]: {
      margin: '25% 0',
    },
  },
  arrow__left: {
    left: '5px',
  },
  arrow__right: {
    left: 'auto',
    right: '5px',
  },
  arrow__disabled: {
    fill: 'rgba(255, 255, 255, 0.5)',
  },
  hide: {
    display: 'none',
  },
}));

interface ArrowProps {
  onClick: (event: any) => Event;
  isShow: boolean;
}

function ArrowLeft({ onClick, isShow }: ArrowProps) {
  const classes = useStyles();

  return (
    <svg
      onClick={onClick}
      className={clsx({
        [classes.arrow]: true,
        [classes.hide]: isShow,
      })}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        opacity="0.7"
        r="12"
        transform="matrix(-1 0 0 1 12 12)"
        fill="#E9E9E9"
      />
      <path
        d="M14.5057 15.85C14.7794 16.1203 14.7794 16.5589 14.5057 16.8291C14.2313 17.0986 13.7859 17.0986 13.5115 16.8291L9.49683 12.8756C9.22317 12.6054 9.22317 12.1668 9.49683 11.8965L13.5115 7.94304C13.7859 7.67356 14.2313 7.67356 14.5057 7.94304C14.7794 8.21331 14.7794 8.65189 14.5057 8.92215L10.9859 12.3876L14.5057 15.85Z"
        fill="#333333"
      />
    </svg>
  );
}

function ArrowRight({ onClick, isShow }: ArrowProps) {
  const classes = useStyles();

  return (
    <svg
      onClick={onClick}
      className={clsx({
        [classes.arrow]: true,
        [classes.hide]: !isShow,
      })}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle opacity="0.7" cx="12" cy="12" r="12" fill="#E9E9E9" />
      <path
        d="M9.49431 15.85C9.22065 16.1203 9.22065 16.5589 9.49431 16.8291C9.76875 17.0986 10.2141 17.0986 10.4885 16.8291L14.5032 12.8756C14.7768 12.6054 14.7768 12.1668 14.5032 11.8965L10.4885 7.94304C10.2141 7.67356 9.76875 7.67356 9.49431 7.94304C9.22065 8.21331 9.22065 8.65189 9.49431 8.92215L13.0141 12.3876L9.49431 15.85Z"
        fill="#333333"
      />
    </svg>
  );
}

export default ({ children, onClick, isNext }) => {
  const classes = useStyles();
  const [currentSlide, setCurrentSlide] = React.useState(0);

  const [sliderRef, slider] = useKeenSlider({
    initial: 0,
    slideChanged(s) {
      setCurrentSlide(s.details().relativeSlide);
    },
  });

  const handleOnClick = (isLeft: boolean, event: any): any => {
    if (isLeft) {
      event.stopPropagation();
      slider.prev();
      onClick(isLeft);
    } else {
      event.stopPropagation();
      slider.next();
      onClick(isLeft);
    }
  };

  return (
    <>
      <div className={classes['navigation-wrapper']}>
        <div
          className={classes['keen-slider']}
          ref={sliderRef as React.RefObject<HTMLDivElement>}
        >
          {slider && (
            <>
              <ArrowLeft
                onClick={(e: any) => handleOnClick(true, e)}
                isShow={isNext}
              />
              {children}
              <ArrowRight
                onClick={(e: any) => handleOnClick(false, e)}
                isShow={isNext}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};

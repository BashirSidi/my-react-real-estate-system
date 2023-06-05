/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/button-has-type */
/* eslint-disable react/display-name */
import 'keen-slider/keen-slider.min.css';
import React, { forwardRef } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core/';

const useStyles = makeStyles<Theme, { pointNumber?: number; isRow?: boolean }>(
  (theme) => ({
    active: {
      background: `${theme.palette.secondary.main} !important`,
    },
    mobile: {
      display: 'flex',
      justifyContent: 'center',
      [theme.breakpoints.up('md')]: {
        display: 'none',
      },
    },
    points: (props) => ({
      display: 'grid',
      gridTemplateColumns: `${Array.from(
        { length: props?.pointNumber || 5 },
        () => '1fr',
      ).join(' ')}`,
      gridGap: '10px',
      [theme.breakpoints.up('md')]: {
        bottom: '30px',
      },
      '& > div': {
        width: '9px',
        height: '9px',
        background: theme.palette.secondary.light,
        borderRadius: '50%',
      },
    }),
    activePoint: {
      background: `${theme.palette.secondary.main} !important`,
    },
    root: {
      padding: '20px 0 50px',
      overflow: 'visible',
      [theme.breakpoints.up('md')]: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridGap: '25px',
      },
    },
    sliderContainer: {
      padding: '0 10px',
    },
  }),
);

declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    options?: any;
  }
}
type DivProps = JSX.IntrinsicElements['div'];

export const Carousel = forwardRef<HTMLElement, DivProps>(
  ({ children }, ref) => {
    const [currentSlide, setCurrentSlide] = React.useState(0);
    const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
      initial: 0,
      slideChanged(s) {
        setCurrentSlide(s.details().relativeSlide);
      },
      slidesPerView: 1,
      spacing: 14,
      loop: true,
    });
    const classes = useStyles({
      pointNumber: React.Children.count(children),
    });

    return (
      <>
        <div className={classes.sliderContainer}>
          <div ref={sliderRef} className={clsx('keen-slider', classes.root)}>
            {children}
          </div>
        </div>
        <div className={classes.mobile}>
          {slider && (
            <div className={classes.points}>
              {[...Array(slider.details().size).keys()].map((idx) => (
                // eslint-disable-next-line jsx-a11y/no-static-element-interactions
                <div
                  key={idx}
                  onClick={() => {
                    slider.moveToSlideRelative(idx);
                  }}
                  className={currentSlide === idx ? classes.activePoint : ''}
                />
              ))}
            </div>
          )}
        </div>
      </>
    );
  },
);

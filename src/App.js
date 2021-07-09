import React, { useEffect, useState, useRef, useMemo } from 'react';
import './App.css';
import moment from 'moment';
import { interval, fromEvent } from 'rxjs';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

export default function App() {
  const [time, setTime] = useState(
    moment()
      .startOf('day')
      .format()
  );
  const start = useRef();
  const wait = useRef();
  const stop = useRef();
  const reset = useRef();
  const [startStream, setStartStream] = useState(false);
  const theme = createTheme({ palette: { type: 'dark' } });

  useEffect(() => {
    let sub,
      curTime = moment(time);

    if (startStream) {
      sub = interval(1000).subscribe(() => {
        curTime.add(1, 'second');
        setTime(curTime.format());
      });
    }

    return () => {
      if (sub) {
        sub.unsubscribe();
      }
    };
  }, [startStream]);

  useEffect(() => {
    const startHandler = () => {
      setStartStream(true);
    };

    const waitHandler = () => {
      setStartStream(false);
    };

    const stopHandler = () => {
      setStartStream(false);
      setTime(
        moment()
          .startOf('day')
          .format()
      );
    };

    const staSub = fromEvent(start.current, 'click').subscribe(startHandler);
    const waiSub = fromEvent(wait.current, 'click').subscribe(waitHandler);
    const stoSub = fromEvent(stop.current, 'click').subscribe(stopHandler);
    const resSub = fromEvent(reset.current, 'click').subscribe(() => {
      stopHandler();
      startHandler();
    });

    return () => {
      staSub.unsubscribe();
      waiSub.unsubscribe();
      stoSub.unsubscribe();
      resSub.unsubscribe();
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="h_full flex j_c_c a_i_c">
        <div>
          <Typography variant="h2" gutterBottom>
            {moment(time).format('HH:mm:ss')}
          </Typography>

          <Collapse in={!startStream}>
            <div className="flex j_c_c">
              <Button variant="contained" color="primary" ref={start}>
                Start
              </Button>

              <div className="w_10" />

              <Button
                variant="contained"
                ref={stop}
                disabled={moment(time).format('HH:mm:ss') === '00:00:00'}
              >
                Stop
              </Button>
            </div>
          </Collapse>

          <Collapse in={startStream}>
            <div className="flex j_c_c">
              <Button variant="contained" color="secondary" ref={wait}>
                Wait
              </Button>

              <div className="w_10" />

              <Button variant="contained" ref={reset}>
                Reset
              </Button>
            </div>
          </Collapse>
        </div>
      </div>
    </ThemeProvider>
  );
}

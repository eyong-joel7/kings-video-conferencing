import { makeStyles } from '@material-ui/core';


import Sidebar from '../Sidebar';
import Notifications from '../Notifications';
import React, { useContext, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

import './curriculumElements.css';

import VideoPlayer from '../VideoPlayer';
import MainControls from '../MainControls';
import { SocketContext } from '../../Context';

const useStyles = makeStyles((theme) => ({
  appBar: {
    borderRadius: 15,
    margin: "30px 100px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "600px",

    [theme.breakpoints.down("xs")]: {
      width: "90%",
    },
  },
  image: {
    marginLeft: "15px",
  },
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
 
  },
}));
const Curriculum = () => {
  const classes = useStyles();
  const {callAccepted, callEnded } = useContext(SocketContext);
  const [isToggled, setIsToggled] = useState(false);

 
  const hiddenClass = useMediaQuery({
    query: '(min-device-width: 900px)',
  });
  const toggleHamburger = () => {
    setIsToggled(!isToggled);
  };

const closeNav = ()=>{
  if((!hiddenClass && isToggled)){
  toggleHamburger();
  }
}
  return (
    <div>
      <div className="ureact-app__container">
        <nav
          className={
            !hiddenClass && !isToggled
              ? "ureact-app__nav primary-and-secondary hidden"
              : "ureact-app__nav primary-and-secondary"
          }
        >
          <a className="nav__a11y-link" href="/">
            Jump to content
          </a>
          <a
            className="nav__a11y-link"
            href="mailto:assurancecademy@gmail.com"
            rel="noreferrer"
            target="_blank"
          >
            Email for accessibility support
          </a>
          <div className="nav__contents">
            <div className="primary-nav">
              <div className="ureact-app__nav nav-small">
                <img
                  src={`${process.env.PUBLIC_URL}images/a_logo2.svg`}
                  className="logo"
                  alt="Assurance Logo"
                />
                <div className="nav-groups">
                  <div className="_nav--nav-group-with-sidebar--2eeny">
                    <ul className="nav-group">
                      <li className="nav-item">
                        <a href="/" title="Home">
                          <span className="nav-item-icon-container">
                            <span className="nav-item-icon">
                              <i
                                className="vds-icon vds-icon--lg"
                                role="img"
                                aria-label="Home"
                                aria-hidden="false"
                              >
                                <svg viewBox="0 0 32 32">
                                  <path d="M16.027 5l.024.001a1.003 1.003 0 01.59.233l6.357 5.334V10a1 1 0 112 0v2.246L26.6 13.59a1 1 0 01-1.286 1.532l-9.316-7.816-7 5.873V24h3v-5a1 1 0 011-1h6a1 1 0 011 1v5h3v-6a1 1 0 112 0v7a1 1 0 01-.883.993L24 26h-5a1 1 0 01-1-1l-.001-5h-4v5a1 1 0 01-.883.993L13 26h-5a1 1 0 01-1-1l-.001-10.143-.315.265a1 1 0 11-1.286-1.532l9.959-8.356.038-.03a.993.993 0 01.039-.029l-.077.059A1.008 1.008 0 0115.998 5h.029z" />
                                </svg>
                              </i>
                            </span>
                          </span>
                          <span className="nav-item-title">Home</span>
                        </a>
                      </li>
                      <li className="nav-item _nav--help--1_fHw _nav--inactive--2UbLW">
                        <a href="/" title="Help">
                          <span className="nav-item-icon-container">
                            <span className="nav-item-icon">
                              <div className="_nav--unread-badge-container--11uuK">
                                <i
                                  className="vds-icon vds-icon--lg"
                                  role="img"
                                  aria-label="Help"
                                  aria-hidden="false"
                                >
                                  <svg
                                    width="32px"
                                    height="32px"
                                    viewBox="0 0 32 32"
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M20.9056439,22.3198574 L18.7573899,20.1716035 C17.9669569,20.6951232 17.0190823,21 16,21 C14.9809177,21 14.0330431,20.6951232 13.2426101,20.1716035 L11.0943561,22.3198574 C12.2108087,23.1877298 13.5633312,23.7662723 15.0393533,23.9429146 C15.3558252,23.9808174 15.6764586,24 16,24 C16.3070466,24 16.6114879,23.9827273 16.9122739,23.9486329 C18.4071083,23.7788703 19.7770024,23.1972048 20.9056439,22.3198574 Z M22.3198574,20.9056439 C23.1876432,19.7893027 23.7661569,18.4369386 23.9428618,16.9610884 C23.9807994,16.6444733 24,16.3236921 24,16 C24,15.66094 23.9789283,15.3250894 23.9374234,14.9938816 C23.7543538,13.5355643 23.1788132,12.1993382 22.3198574,11.0943561 L20.1716035,13.2426101 C20.6951232,14.0330431 21,14.9809177 21,16 C21,17.0190823 20.6951232,17.9669569 20.1716035,18.7573899 L22.3198574,20.9056439 Z M9.68014258,20.9056439 L11.8283965,18.7573899 C11.3048768,17.9669569 11,17.0190823 11,16 C11,14.9809177 11.3048768,14.0330431 11.8283965,13.2426101 L9.68014258,11.0943561 C8.75342324,12.2865108 8.15660061,13.7478348 8.02673162,15.341271 C8.00895977,15.5592098 8,15.7789209 8,16 C8,16.3251272 8.01937157,16.6473163 8.05756371,16.9653104 C8.2349426,18.4395081 8.81318121,19.7903633 9.68014258,20.9056439 Z M20.9056439,9.68014258 C19.7335902,8.76904878 18.3013679,8.17682061 16.7392171,8.03369844 C16.4949216,8.01130505 16.248325,8 16,8 C15.7817017,8 15.5647353,8.00873521 15.3494842,8.02603419 C13.7528597,8.15454966 12.2885602,8.75183017 11.0943561,9.68014258 L13.2426101,11.8283965 C14.0330431,11.3048768 14.9809177,11 16,11 C17.0190823,11 17.9669569,11.3048768 18.7573899,11.8283965 L20.9056439,9.68014258 Z M17.1571043,25.9336732 C16.7754602,25.9776915 16.3892728,26 16,26 C15.6319008,26 15.2665884,25.9800494 14.9052998,25.9406688 C9.89744209,25.395509 6,21.1529027 6,16 C6,10.4771525 10.4771525,6 16,6 C21.1579592,6 25.4038347,9.90509495 25.94236,14.9200185 C25.9805835,15.2765119 26,15.6368877 26,16 C26,16.3682524 25.9800328,16.7337155 25.9406197,17.0951506 C25.4366843,21.7224466 21.7758854,25.4015822 17.157131,25.9337731 Z M16,19 C17.6568542,19 19,17.6568542 19,16 C19,14.3431458 17.6568542,13 16,13 C14.3431458,13 13,14.3431458 13,16 C13,17.6568542 14.3431458,19 16,19 Z"
                                      id="Combined-Shape"
                                      fillRule="nonzero"
                                    />
                                  </svg>
                                </i>
                                <div className="_nav--unread-badge--_gCfX" />
                              </div>
                            </span>
                          </span>
                          <span className="nav-item-title">Help</span>
                        </a>
                      </li>
                      {/* <li className="nav-item">
                        <a href="/" title="Transcript">
                          <span className="nav-item-icon-container">
                            <span className="nav-item-icon">
                              <i
                                className="vds-icon vds-icon--lg"
                                role="img"
                                aria-label="Enterprise Transcript"
                                aria-hidden="false"
                              >
                                <svg viewBox="0 0 33 32">
                                  <path d="M22 6a2 2 0 012 2v10.64a2 2 0 01-.59 1.419l-5.394 5.36a2 2 0 01-1.41.581H10a2 2 0 01-2-2V8a2 2 0 012-2h12zm0 2H10v16h6v-4.01c0-1.097.897-1.99 1.99-1.99H22V8zm-1.414 12H18v2.586L20.586 20zM19 14a1 1 0 010 2h-6a1 1 0 010-2zm0-4a1 1 0 010 2h-6a1 1 0 010-2z" />
                                </svg>
                              </i>
                            </span>
                          </span>
                          <span className="nav-item-title">Transcript</span>
                        </a>
                      </li>
                */}
                    </ul>
                  </div>
                  <div className="_nav--nav-group-with-sidebar--2eeny">
                    <ul className="nav-group">
                      <li className="nav-item">
                        <a href="/" title="Settings">
                          <span className="nav-item-icon-container">
                            <span className="nav-item-icon">
                              <i
                                className="vds-icon vds-icon--lg"
                                role="img"
                                aria-label="Settings"
                                aria-hidden="false"
                              >
                                <svg viewBox="0 0 33 32">
                                  <path d="M4.031 14.022c0-1.104.89-1.99 2.003-1.99l.83-.001a9.992 9.992 0 011.187-2.027l-.384-.667a2.002 2.002 0 01.722-2.73l3.48-2.009a1.99 1.99 0 012.726.74l.429.743a10.119 10.119 0 011.724-.025l.416-.719a2.002 2.002 0 012.725-.739l3.48 2.01a1.99 1.99 0 01.723 2.73l-.255.442a9.998 9.998 0 011.362 2.25l.83.001c1.101 0 2.002.895 2.002 1.99v4.02a1.99 1.99 0 01-2.003 1.99h-.83a9.997 9.997 0 01-1.34 2.226l.234.406a2.002 2.002 0 01-.723 2.73l-3.48 2.009a1.99 1.99 0 01-2.725-.74l-.38-.659a10.142 10.142 0 01-1.794-.025l-.395.685a2.002 2.002 0 01-2.726.739l-3.48-2.01a1.99 1.99 0 01-.722-2.73l.363-.631a9.991 9.991 0 01-1.167-2h-.829a2.002 2.002 0 01-2.003-1.99v-4.02zm2 4.018c0-.003.363-.006 1.088-.007l.517-.001H8.283a7.993 7.993 0 002.196 3.76l-1.08 1.87 3.47 2.008c-.004-.003.36-.64 1.092-1.91a8.025 8.025 0 003.875.067l1.06 1.836 3.473-2.003c-.004.003-.332-.559-.983-1.685a7.999 7.999 0 002.393-3.944h2.25v-.445-.105l.001-1.232v-.203l.001-2.024c0 .003-.266.005-.8.007H24.783l-.356.001h-.194l-.356.001h-.097a7.998 7.998 0 00-2.418-3.966l.999-1.728-3.47-2.007c.004.003-.358.636-1.086 1.899a8.013 8.013 0 00-3.812.065l-1.13-1.957L9.39 8.34c.005-.003.376.634 1.114 1.91a7.982 7.982 0 00-2.22 3.78l-2.249.001v.446l-.001.104v1.435L6.03 17.75v.291zm6-2.009a4 4 0 118 0 4 4 0 01-8 0zm2 0a2 2 0 104 0 2 2 0 00-4 0z" />
                                </svg>
                              </i>
                            </span>
                          </span>
                          <span className="nav-item-title">Settings</span>
                        </a>
                      </li>
                      <li className="nav-item">
                        <a href="/" title="Logout">
                          <span className="nav-item-icon-container">
                            <span className="nav-item-icon">
                              <i
                                className="vds-icon vds-icon--lg"
                                role="img"
                                aria-label="Logout"
                                aria-hidden="false"
                              >
                                <svg viewBox="0 0 32 32">
                                  <path d="M25 6a1 1 0 011 1v18a1 1 0 01-1 1h-6a1 1 0 01-1-1v-3a1 1 0 012 0v2h4V8h-4v2a1 1 0 01-2 0V7a1 1 0 011-1zm-13.707 4.293a1 1 0 011.414 1.414L9.414 15H21a1 1 0 01.993.883L22 16a1 1 0 01-1 1H9.414l3.293 3.293a1 1 0 01.083 1.32l-.083.094a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414z" />
                                </svg>
                              </i>
                            </span>
                          </span>
                          <span className="nav-item-title">Logout</span>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
        <main className="ureact-app__main">
          <div className="title-area">
            <div className="ureact-app__header">
              <div>
                <div>
                  {/* this class has to be dynamic based by windows.scroll _header-content--header-small--3sk5P shared--outer-container--3eppq */}
                  <div className="_header-content--header--3mdiS shared--outer-container--3eppq">
                    <div
                      className="hamburger--hamburger--1oS_7"
                      style={{ display: hiddenClass ? "none" : "block" }}
                    >
                      <button
                        className="vds-round-button vds-round-button--minimal-inverse vds-round-button--icon"
                        type="button"
                        onClick={() => toggleHamburger()}
                      >
                        <span className="vds-round-button__content">
                          <i
                            className="vds-icon vds-color--cerulean"
                            role="img"
                            aria-label="Toggle Sidebar"
                            aria-hidden="false"
                          >
                            <svg viewBox="0 0 33 32">
                              <path d="M24 21a1 1 0 010 2H8a1 1 0 010-2h16zm0-6a1 1 0 010 2H8a1 1 0 010-2h16zm0-6a1 1 0 010 2H8a1 1 0 010-2h16z" />
                            </svg>
                          </i>
                          <span className="vds-visually-hidden" />
                        </span>
                      </button>
                    </div>

                    <div className="_header-content--part-info--3iVwL">
                      <h1>
                      KINGS' ROOM
                      </h1>
                      {/* <p className="_header-content--part-type--1Fn_- shared--label-regular--31PUI shared--context-label--1Ij2n">
                        Core Curriculum
                      </p> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Put video thumbnail here */}
          <div
            className="content-area"
            style={{ backgroundColor: "rgb(250, 251, 252)" }}
          >
            <div aria-hidden="true" className="hidden-header">
              <div className="ureact-app__header">
                <div>
                  <div>
                    <div className="_header-content--header--3mdiS shared--outer-container--3eppq">
                      <div className="_header-content--part-info--3iVwL">
                        <h1>
                        KINGS' ROOM
                        </h1>
                        {/* <p className="_header-content--part-type--1Fn_- shared--label-regular--31PUI shared--context-label--1Ij2n">
                          Core Curriculum
                        </p> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              id="content"
              className="ureact-app__body"
              onClick={() => closeNav()}
            >
              <div className="index--container--uI0r1">
                <div className="index--body--3G2lS">
                  <div className={classes.wrapper}>
                    <VideoPlayer />
                    {
                      (!callAccepted || callEnded) &&  <Sidebar>
                      <Notifications />
                    </Sidebar>
                    }
                   
                  </div>

                  {/* put main video here */}
                </div>
                <span
                  className="footer-link--footer-link--3EuAW"
             
                >
                  <div className="footer-link--contents--1AXQE shared--outer-container--3eppq">
                    {/* <div className="footer-link--text--1vhx_">
                      <h3>Up Next</h3>
                      <h2 title="React &amp; Redux">React &amp; Redux</h2>
                    </div> */}
                    {/* <span className="footer-link--arrow--21K6x">
                      <i
                        className="vds-icon"
                        role="img"
                        aria-label="caret right"
                        aria-hidden="false"
                      >
                        <svg viewBox="0 0 32 32">
                          <path d="M12 11.902v8.196a.5.5 0 00.765.424l6.557-4.098a.5.5 0 000-.848l-6.557-4.098a.5.5 0 00-.765.424z" />
                        </svg>
                      </i>
                    </span>
                */}
                <MainControls/>
                  </div>
                </span>
              </div>
            </div>
          </div>{" "}
        </main>{" "}
      </div>
    </div>
  );
};

export default Curriculum;

import React, { useState } from "react";
import "./style.css";
import Badge from "@material-ui/core/Badge";
import GroupIcon from "@material-ui/icons/Group";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import { useMediaQuery } from "react-responsive";
import { ClickAwayListener } from "@material-ui/core";
import ScreenShareOutlinedIcon from "@mui/icons-material/ScreenShareOutlined";
import StopScreenShareOutlineIcon from "@mui/icons-material/StopScreenShare";

const MainControls = (props) => {
  const [open, setOpen] = useState(false);
  const {
    host,
    leaveCall,
    playStop,
    muteUnmute,
    main__mute_button,
    main__video_button,
    main__share_button,
    stream,
    users,
    setIsNewMessage,
    toggleHamburger,
    setSelected,
    selected,
    setCopyInfo,
    isNewMessage,
    shareStop,
    isShareToggled,
  } = props;

  console.log(selected);

  const isLaptop = useMediaQuery({
    query: "(min-device-width: 768px)",
  });
  const handleClick = () => {
    setOpen((prev) => !prev);
  };

  const handleClickAway = () => {
    setOpen(false);
  };
  return (
    <div className="main__controls">
      {stream && (
        <div className="main__controls__block">
          <div
            id="muteunmute"
            ref={main__mute_button}
            onClick={muteUnmute}
            className="main__controls__button main__mute_button"
          >
            <i className="fas fa-microphone"></i>
            <span>Mute</span>
          </div>
          <div
            id="playstop"
            ref={main__video_button}
            onClick={playStop}
            className="main__controls__button main__video_button"
          >
            <i className="fas fa-video"></i>
            <span>Stop Video</span>
          </div>
        </div>
      )}

      <div className="main__controls__block">
        <div
          className="main__controls__button participants"
          onClick={() => {
            toggleHamburger();
            setSelected("users");
          }}
        >
          <Badge badgeContent={users?.length} color="primary">
            <GroupIcon />
          </Badge>
          <span>Participants</span>
        </div>
        {!isLaptop ? (
          <ClickAwayListener onClickAway={handleClickAway}>
            <div className="main__controls__button" onClick={handleClick}>
              {/* invisible={invisible} */}
              <Badge
                color="secondary"
                variant="dot"
                invisible={selected === "chat" || !isNewMessage}
              >
                <MoreHorizIcon style={{ display: open ? "none" : "block" }} />
              </Badge>
              {open ? (
                <div className="dropdown">
                  <div
                    style={{ flexDirection: "row" }}
                    className="main__controls__button"
                    onClick={() => {
                      toggleHamburger();
                      setSelected("chat");
                      setIsNewMessage(false);
                    }}
                  >
                    <i className="fas fa-comment-alt"></i>
                    <span style={{ marginLeft: "5px" }}>Chat</span>
                  </div>
                  <div
                    style={{ flexDirection: "row" }}
                    className="main__controls__button"
                    onClick={() => {
                      setCopyInfo(true);
                    }}
                  >
                    <span>
                      <PersonAddIcon />
                    </span>
                    <span style={{ marginLeft: "5px" }}>Invite</span>
                  </div>
                  {!!stream && !!host (
              <div
                id="sharestop"
                ref={main__share_button}
                className="main__controls__button"
                onClick={shareStop}
              >
                {!isShareToggled ? (
                  <>
                    <span>
                    <ScreenShareOutlinedIcon />
                    </span>
                    <span>Share</span>{" "}
                  </>
                ) : (
                  <>
                    <span>
                      <StopScreenShareOutlineIcon />
                    </span>
                    <span>Stop</span>
                  </>
                )}
              </div>
            )}

                </div>
              ) : null}

              <span style={{ display: open ? "none" : "block" }}>More</span>
            </div>
          </ClickAwayListener>
        ) : (
          <>
            <div
              className="main__controls__button"
              onClick={() => {
                toggleHamburger();
                setSelected("chat");
                setIsNewMessage(false);
              }}
            >
              <Badge
                color="secondary"
                variant="dot"
                invisible={selected === "chat" || !isNewMessage}
              >
                <i className="fas fa-comment-alt"></i>
              </Badge>
              <span>Chat</span>
            </div>
            <div
              className="main__controls__button"
              onClick={() => {
                setCopyInfo(true);
              }}
            >
              <span>
                <PersonAddIcon />
              </span>
              <span>Invite</span>
            </div>
            {!!stream && !!host (
              <div
                id="sharestop"
                ref={main__share_button}
                className="main__controls__button"
                onClick={shareStop}
              >
                {!isShareToggled ? (
                  <>
                    <span>
                    <ScreenShareOutlinedIcon />
                    </span>
                    <span>Share</span>{" "}
                  </>
                ) : (
                  <>
                    <span>
                      <StopScreenShareOutlineIcon />
                    </span>
                    <span>Stop</span>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>
      <div className="main__controls__block">
        <div className="main__controls__button leave">
          <span className="leave_meeting" onClick={leaveCall}>
            Leave
          </span>
        </div>
      </div>
    </div>
  );
};
export default MainControls;

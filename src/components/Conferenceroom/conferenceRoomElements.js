import styled from "styled-components";

export const VideoContainer = styled.div`
    box-sizing:border-box;
    width: 100vw;
    margin-right: auto;
    margin-left: auto;
    height: 100%;
    justify-content: center;
    display: flex;
    overflow:hidden;
    padding: 20px;
`;

export const VideoWrapper = styled.div`
  display: grid;
   max-height: 100%;
   width: auto;
   max-width:100%;
   /* padding: 10px;
   grid-gap: 5%; */
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  grid-gap: 10px; 
  justify-items: center;
  overflow:hidden;
  @media screen and (max-width: 768px) {
    grid-gap: 5px; 
  }
`;

export const VideoCard = styled.div`
  display: flex;
  flex-direction: column;
  width:100%;
  justify-content: flex-start;
  align-items: center; 
  border-radius: 5px;
  height:100%;
  overflow: hidden;
  padding:5px;
  margin:5px;
  border: 2px solid rgba(0, 0, 0, 0.5);
  transition: all 0.2s ease-in-out;
  &:hover {
    transform: scale(1.01);
  }
`;

export const VideoStream = styled.video`
   height: 80%;
  -ms-transform:${({mirrorMode}) => mirrorMode ? 'scaleX(-1)': null};
  -moz-transform: ${({mirrorMode}) => mirrorMode ? 'scaleX(-1)': null};
  -webkit-transform: ${({mirrorMode}) => mirrorMode ? 'scaleX(-1)': null};
  transform: ${({mirrorMode}) => mirrorMode ? 'scaleX(-1)': null};
`;

export const FooterContainer = styled.div`
display:flex;
max-height:20%;
flex-wrap:nowrap;
align-items: center;
padding: 5px;
width: 100%;
justify-content: center;
`;


export const UserNameText = styled.h4`
  font-size: 1rem;
  color: #f1f1f1;
  text-align: left;
  font-weight: bold;
  text-transform: capitalize;
  padding: 0 10px;
  @media screen and (max-width: 768px) {
    font-size: 1.4rem;
    padding: 0 10px;
  }
`;
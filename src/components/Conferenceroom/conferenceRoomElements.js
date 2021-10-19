import styled from "styled-components";

export const VideoContainer = styled.div`
    box-sizing:border-box;
    width: 100vw;
    margin-right: auto;
    margin-left: auto;
    /* padding-right: 15px;
    padding-left: 15px; */
    /* height: 85vh; */
    justify-content: center;
    display: flex;
    overflow:hidden;
    max-height:100%;
`;

export const VideoWrapper = styled.div`
  display: grid;
   max-height: 100%;
  width: 100%;
  grid-template-columns: repeat(auto-fit, minmax(50vw, 1fr));
  grid-template-rows: repeat(auto-fit, minmax(50vw, 1fr));
  justify-items: center;
  overflow:hidden;
 
  @media screen and (max-width: 1000px) {
    grid-template-columns: repeat(auto-fit, minmax(50vw, 1fr));
    grid-template-rows: repeat(auto-fit, minmax(50vw, 1fr));
  }
`;

export const VideoCard = styled.div`
  display: flex;
  flex-direction: column;
  width:100%;
  justify-content: space-between;
  align-items: center;
  border-radius: 5px;
  height: 100%;
  padding: 20px;
  margin:0;
  /* box-shadow: 0 1px 3px rgba(0, 0, 0, 0.5); */
  transition: all 0.2s ease-in-out;
  &:hover {
    transform: scale(1.01);
  }
`;

export const VideoStream = styled.video`
   max-height: 100%;
   max-width:95%;
  -ms-transform:${({mirrorMode}) => mirrorMode ? 'scaleX(-1)': null};
  -moz-transform: ${({mirrorMode}) => mirrorMode ? 'scaleX(-1)': null};
  -webkit-transform: ${({mirrorMode}) => mirrorMode ? 'scaleX(-1)': null};
  transform: ${({mirrorMode}) => mirrorMode ? 'scaleX(-1)': null};
`;

export const FooterContainer = styled.div`
display:flex;
max-height:50px;
flex-wrap:nowrap;
align-items: center;
padding: 5px;
width: 80%;
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
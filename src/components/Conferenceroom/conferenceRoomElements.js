import styled from "styled-components";

export const VideoContainer = styled.div`
  width: 100%;
    margin-right: auto;
    margin-left: auto;
    padding-right: 15px;
    padding-left: 15px;
    max-height: 100%;
    justify-content: center;
    display: flex;
`;



export const VideoCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  border-radius: 5px;
  height: 100%;
  padding: 0;
  margin:0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
  transition: all 0.2s ease-in-out;
  &:hover {
    transform: scale(1.01);
  }
`;

export const VideoStream = styled.video`
  height: 100%;
  width: 100%;
`;
export const FooterContainer = styled.footer`
display:flex;
height:50px;
flex-wrap:nowrap;
align-items: center;
padding: 5px;
width: 100%;
justify-content: space-between;
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
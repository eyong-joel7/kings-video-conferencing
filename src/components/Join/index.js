
import React from "react";
import Card from "../Card";



const JoinAMeeting = (props) => {
  const {pageControl, redirect} = props;
  return (
    <>
      <Card join redirect = {redirect} pageControl = {pageControl}/>
    </>
  );
};

export default JoinAMeeting;

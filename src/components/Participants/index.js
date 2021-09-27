import React, { useEffect, useState } from 'react'
import './participants.css';
import SimpleList from './ReactList';
import SearchAppBar from './AppBar'

const Participants = ({toggleControls, users, user, setSelected, setDisplayUser}) => {
  const [usersList, setUserList]  = useState([])
  useEffect(() => {
    setUserList([...users]);
  }, [users]);

    return (
        <div className="outerContainer">
        <div className="container">
        <SearchAppBar setUserList = {setUserList} usersList = {usersList} users = {users} toggleControls = {toggleControls}/>
        {
      users
        ? (
          <>
           <SimpleList setDisplayUser = {setDisplayUser} setSelected = {setSelected} users = {usersList} user = {user}/>
          </>
        )
        : null
    }
        </div>
       
      </div>
    )
}

export default Participants

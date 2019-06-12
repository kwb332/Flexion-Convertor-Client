//About - SideNav in Teacher's Dashboard
//Ref ./Dashboard.js

import React from 'react';

import { Nav, NavItem } from 'reactstrap';



const SideNav = (props) => {

  const tabItems = ["Create Exam", "Add Questions", "My Reports"]

  return (
    <Nav vertical className="pl-3 mb-5">

      { tabItems.map( ( item, index) => 
       
          <NavItem key={index} className="mb-3" style={props.currentTab === item ? { color: '#007bff', cursor: 'pointer' } 
          : { color: '#343a40', cursor: 'pointer' }} onClick={() => props.changeTab(item)}>
              {item}
          </NavItem>

      )
    }
    </Nav>
  );
}


export default SideNav;

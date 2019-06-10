import React from 'react';

import { Nav, NavItem } from 'reactstrap';


const SideNav = (props) => {
  return (
    <Nav vertical className="pl-3">

      <NavItem className="mb-3" style={props.currentTab === "exam" ? { color: '#007bff', cursor: 'pointer' } 
                : { color: '#343a40', cursor: 'pointer' }} onClick={() => props.changeTab("exam")}>
        Add Exam/Questions
          </NavItem>

      <NavItem style={props.currentTab === "report" ? { color: '#007bff', cursor: 'pointer' }
               : { color: '#343a40', cursor: 'pointer' }} onClick={() => props.changeTab("report")}>
         My Reports
      </NavItem>

    </Nav>
  );
}


export default SideNav;

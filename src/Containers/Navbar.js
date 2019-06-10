// This is the Navbar, when the link is active the actstyle css will be activated
// Navbar is imported in Apps.js and applied globally to the application.

import React from 'react';
import {NavLink} from 'react-router-dom'

import {
    Navbar,
    NavbarBrand,
    Nav,
    NavItem
 } from 'reactstrap';

 const actstyle={color: '#007bff'};
 

 const Navigation = () => {
    return (
        <header>
            <Navbar color="light" light expand="md" className='mb-5'>
                   <NavbarBrand>Online Testing System</NavbarBrand>

                  <Nav className="ml-auto" navbar>

                    <NavItem className={"mr-3"}> 
                      <NavLink to="/teacher" activeStyle={actstyle} style={{color: '#343a40'}}>Teacher</NavLink>
                    </NavItem>

                    <NavItem className={"mr-3"}>
                      <NavLink to="/student" activeStyle={actstyle} style={{color: '#343a40'}}>Student</NavLink>
                    </NavItem>

                                        
                    <NavItem> 
                       <NavLink exact to="/" activeStyle={actstyle} style={{color: '#343a40'}}>Home</NavLink>
                    </NavItem>

                  </Nav>
            </Navbar>
        </header>
    )
 }

 export default Navigation;
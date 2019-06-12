//This is the main landing page with login form

import React,  { useState } from 'react';
import {Link} from 'react-router-dom';

//css
import { Button, Form, FormGroup, Label, Input, Container, Row, Col} from 'reactstrap';

const Login =() =>{
    const [userRole, setUserRole] = useState('teacher');

    const FormStyle={
        border: '1px solid #eee',
        padding: '30px',
       margin: '30px'
    }

    return(
        <Container>
             <Row className="justify-content-center align-items-center">
                <Col className="col col-sm-6 col-md-6 col-lg-5 col-xl-5">
                    <Form style={FormStyle}>
                        <FormGroup>
                            <Label for="exampleSelect">Sign in as:</Label>
                            <Input type="select" name="select" id="exampleSelect" onChange={(e) => setUserRole(e.target.value)}>
                                <option value="teacher">Teacher</option>
                                <option value="student">Student</option>
                            </Input>
                        </FormGroup>


                    <Link to={userRole}>
                        <FormGroup className="clearfix">
                            <Button color="primary" className="float-right">Sign In</Button>
                        </FormGroup>
                    </Link>
                </Form>
                </Col>
        </Row>
      </Container>
    )

}

export default Login
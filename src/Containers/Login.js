//This is the main landing page with login form

import React,  { useState } from 'react';
import {Link} from 'react-router-dom';

//css
import { Button, Form, FormGroup, Label, Input, Container } from 'reactstrap';

const Login =() =>{
    const [userRole, setUserRole] = useState('teacher');

    const FormStyle={
        maxWidth: '400px',
       border: '1px solid #eee',
       padding: '30px',
       margin: '30px'
    }

    return(
        <Container>
             <div className="row justify-content-center align-items-center">
             <div className="col col-sm-6 col-md-6 col-lg-4 col-xl-3">
                <Form style={FormStyle}>
                    <FormGroup>
                        <Label for="exampleSelect">Sign in as:</Label>
                        <Input type="select" name="select" id="exampleSelect" onChange={(e) => setUserRole(e.target.value)}>
                            <option value="teacher">Teacher</option>
                            <option value="student">Student</option>
                        </Input>
                    </FormGroup>

                <Link to={userRole}>
                    <Button color="primary">Sign In</Button>
                </Link>
        </Form>
        </div>
        </div>
      </Container>
    )

}

export default Login
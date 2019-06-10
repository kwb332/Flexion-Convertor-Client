//page for /teachers url 
//It calls CreateExam when Add Exam button is pressed i.e. addExamState is true
// Program Heirarchy App.js > Teachers
///////////////////////////////////////////////////////////////////////////////////////////////////

import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {graphql, compose} from 'react-apollo';

//styling
import { Button, Form, FormGroup, Label, Input, Container, Row, Col } from 'reactstrap';

//graphql queries
import {getTeachers} from '../../Services/User/userService';


const Teachers =(props) => {
        
    const [teacherId, setexamTeacher] = useState("0");


    //Get details of the teachers
    let teacherData = props.getTeachers;
    let displayTeachers;

    if(teacherData.loading){
        displayTeachers = <option value="0">Loading .. </option>
    } else if(teacherData.error){
        displayTeachers = <option value="0">Error loading </option>
        }
    else{
        displayTeachers = teacherData.teachers.map( teacher => {
        return <option key={teacher.userId} value={teacher.userId}>{teacher.firstName} {teacher.lastName}</option>
        })
     }

    return(
                <Container>

                    <Row className="justify-content-center">
                        <Col sm="6"> 
                            <Form>
                                <FormGroup>
                                    <Label for="teachersSelect">Teachers Log In</Label>
                                    <Input required type="select" name="select" id="teachersSelect" 
                                        onChange={e => setexamTeacher(e.target.value)}>
                                                <option value="">Select Teacher</option>   
                                                {displayTeachers}       
                                    </Input>

                                </FormGroup>
                            </Form>

                                <Link to={`${props.location.pathname}/${teacherId}/dashboard`}>
                                        <Button color="primary" disabled={teacherId === "0"} className="float-right">Continue To Dashboard</Button>
                                </Link>                         
                            </Col>
                        </Row>
                </Container>
    )

}


export default compose(
        graphql(getTeachers, {name: "getTeachers" }))(Teachers);
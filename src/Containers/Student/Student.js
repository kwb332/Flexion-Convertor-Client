//page for /student url 
//It calls CreateExam when Add Exam button is pressed i.e. addExamState is true
// Program Heirarchy App.js > Teachers
///////////////////////////////////////////////////////////////////////////////////////////////////

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { graphql, compose } from 'react-apollo';

//styling
import { Button, Form, FormGroup, Label, Input, Container, Row, Col } from 'reactstrap';

//graphql queries
import { getStudents } from '../../Services/User/userService';



const Students = (props) => {

    const [studentId, setStudentId] = useState("0");


    //students list dropdown
    let displayStudents;
    let studentData = props.getStudents;

    if (studentData.loading) {
        displayStudents = <option value="0">Loading .. </option>
    } else if (studentData.error) {
        displayStudents = <option value="0">Error Loading</option>
    }
    else {
        displayStudents = studentData.students.map(student => {
            return <option key={student.userId} value={student.userId}>{student.firstName} {student.lastName}</option>
        })
    }


    return (
        <Container>

            <Row className="justify-content-center">
                <Col sm="6">
                    <Form>
                        <FormGroup>
                            <Label for="studentsSelect">Student Log In</Label>
                            <Input type="select" name="select" id="studentsSelect" value={studentId}
                                onChange={(e) => setStudentId(Number(e.target.value))}>
                                <option value="0">Select Student</option>
                                {displayStudents}
                            </Input>
                        </FormGroup>
                    </Form>

                    <Link to={`${props.location.pathname}/${studentId}/dashboard`}>
                        <Button color="primary" disabled={studentId === "0"} className="float-right">Continue To Dashboard</Button>
                    </Link>
                </Col>
            </Row>
        </Container>
    )

}


export default compose(
    graphql(getStudents, { name: "getStudents" }))(Students);
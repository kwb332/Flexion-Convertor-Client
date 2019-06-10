// About - This is the dashboard component, teacher can create exam for a student or add questions 
// to exams created by the active teacher fom the teacher's dashboard.

import React, { useState, Fragment } from 'react';

//styling
import { Form, FormGroup, Label, Input, Button, Container, Col, Row } from 'reactstrap';


//graphql
import { graphql, compose } from 'react-apollo';
import { addExam, getexamByTeacherID } from '../../Services/Exam/examService';
import { getStudents } from '../../Services/User/userService';

//components

import Alert from '../../Components/AlertBox';
import AddQuestions from './AddQuestions';


const CreateExam = (props) => {

    const [studentId, setStudentId] = useState("0");
    const [description, setExamDesc] = useState("");
    const [createExamResp, setCreateExamResp] = useState()
    const [loadAddQuestions, setloadAddQuestions] = useState(false)


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



    //Submit Form - Create Exam on sucess call the exams list

    const createExam = (e) => {
        e.preventDefault();

        props.addExam({
            variables: {
                examAdd: {
                    description,
                    studentId,
                    "teacherId": props.teacherId
                }
            },
            refetchQueries: () => [{ query: getexamByTeacherID, variables: { teacherID: Number(props.teacherId) } }]
        }).then((resp) => setCreateExamResp(resp.data.addExam))
            .catch((err) => setCreateExamResp(err.data.addExam))
    }


    //This is to toggle between show AddQuestions or CreateExam
    const toggleComponents = () => {
        setloadAddQuestions(prevState => !prevState);
    }


    //This is used to reset the form for new entries

    const reset = () => {
        setStudentId("0");
        setExamDesc("");
        setCreateExamResp();
    }

    return (
        <Fragment>

            <Container className="mt-3 mb-5 mr-2">
                <h2 className="pb-2 mt-2">Create Exam</h2>

                <Row>
                    <Col md="6">

                        {/* Message to be displayed after successful exam creation */}
                        {createExamResp ? <Alert status={"success"} title={'Success'}
                            message={"Exam created successfully. Please go to 'Add Questions' to add questions and assign exam to your student."} />
                            :
                            createExamResp === false ? <Alert status={"danger"} title={'Something went wrong!'}
                                message={'Please try again.'} /> : null
                        }


                        <Form onSubmit={createExam} className={"border border-light p-3 clearfix"}>
                            <FormGroup>
                                <Label for="studentsSelect">Assign Exam to</Label>
                                <Input type="select" name="select" value={studentId} id="studentsSelect"
                                    onChange={(e) => setStudentId(Number(e.target.value))}>
                                    <option value="0">Select Student</option>
                                    {displayStudents}
                                </Input>
                            </FormGroup>

                            <FormGroup>
                                <Label for="description">Description</Label>
                                <Input id="description" required placeholder="Briefly describe the exam" autoComplete="off"
                                    value={description} onChange={(e) => setExamDesc(e.target.value)} />
                            </FormGroup>

                            <Row className="mt-3 float-right pr-3">
                                <FormGroup className="mr-3">
                                    <Button color="muted" className="border border-primary" onClick={reset}
                                        disabled={!createExamResp}>New</Button>
                                </FormGroup>

                                <FormGroup>
                                    <Button color="primary" disabled={(studentId === "0")} type="submit">Create</Button>
                                </FormGroup>
                            </Row>


                        </Form>
                    </Col>
                </Row>

                <p className={"mt-5 mb-5"} style={{ color: "#007bff", textAlign: 'left', cursor: 'pointer' }} onClick={toggleComponents} >
                    {loadAddQuestions ? "Hide Add Questions" : "Show Add Questions"}
                </p>

                {loadAddQuestions ?
                    <Row>
                        <Col md="6">
                            <AddQuestions teacherId={props.teacherId} />
                        </Col>
                    </Row> : null}
            </Container>

        </Fragment>


    );
}





export default compose(graphql(addExam, { name: 'addExam' }),
    graphql(getStudents, { name: "getStudents" }))(CreateExam);


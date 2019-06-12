// About - This is the dashboard component, teacher can create exam for a student or add questions 
// to exams created by the active teacher fom the teacher's dashboard.

import React, { useState, Fragment } from 'react';

//styling
import { Form, FormGroup, Label, Input, Button, Container, Col, Row } from 'reactstrap';


//graphql
import { graphql, compose } from 'react-apollo';
import { addExam, getexamByTeacherID } from '../../../Services/Exam/examService';
import { getStudents } from '../../../Services/User/userService';

//components

import Alert from '../../../Components/AlertBox';
import  ExamList from './ExamList';
import Spinner from '../../../Components/Spinner';

const CreateExam = (props) => {

    const [studentId, setStudentId] = useState("0");
    const [description, setExamDesc] = useState("");
    const [createExamResp, setCreateExamResp] = useState();
    const [loadExamsList, setLoadExamsList] = useState(false);
    const [loadingState, setLoadingState] = useState(false);


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
        }).then((resp) => setCreateExamResp(resp.data.addExam), setLoadingState(false))
            .catch((err) => setCreateExamResp(err.data.addExam), setLoadingState(false))
    }


    //This is to toggle between show & hide exams list
    const toggleComponents = () => {
        setLoadExamsList(prevState => !prevState);
    }


    //This is used to reset the form for new entries

    const reset = () => {
        setStudentId("0");
        setExamDesc("");
        setCreateExamResp();
        setLoadingState(false);
    }

    return (
        <Fragment>

            <Container className="mt-3 mb-5 mr-2">
                <h2 className="pb-2 mt-2">Create Exam</h2>

                <Row>
                    <Col md="8">

                        {/* Message to be displayed after successful exam creation */}
                        {createExamResp ? <Alert status={"success"} title={'Success'}
                            message={"Exam created successfully. Please go to 'Add Questions' to add questions and assign exam to your student."} />
                            :
                            createExamResp === false ? <Alert status={"danger"} title={'Something went wrong!'}
                                message={'Please try again.'} /> : null
                        }

                        { loadingState ? <Spinner /> :

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
                                        <Button color="primary" disabled={(studentId === "0" || createExamResp)} type="submit">Create</Button>
                                    </FormGroup>
                                </Row>


                            </Form>

                        }
                        <p className={"mt-5 mb-5"} style={{ color: "#007bff", textAlign: 'left', cursor: 'pointer' }} onClick={toggleComponents} >
                            {loadExamsList ? "Hide Exams List" : "Show Exams List"}
                        </p>
                    </Col>

                </Row>

                {loadExamsList ? <ExamList teacherId={props.teacherId}/> : null}
            </Container>

        </Fragment>


    );
}





export default compose(graphql(addExam, { name: 'addExam' }),
    graphql(getStudents, { name: "getStudents" }))(CreateExam);


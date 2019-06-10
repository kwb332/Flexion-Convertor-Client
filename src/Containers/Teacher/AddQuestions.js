//About - This is the component to add questions by clicking 'add questions' button in Exams list under /create-exam page.
//Teachers can select the question, add it to exams then assign it to the student.
//Program Heirarchy App.js > Teacher.js > Dashboard 
///////////////////////////////////////////////////////////////////////////////////////////////////

import React, { useState, Fragment } from 'react';

//Styling
import { Row, Col, Button, Form, FormGroup, Label, Input } from 'reactstrap';

//graphql
import { graphql, compose } from 'react-apollo';
import {
    getConversions, getexamByTeacherID,
    addQuestion, submitExamToStudent
} from '../../Services/Exam/examService';

//components
import Alert from '../../Components/AlertBox';
import { checkValid } from '../../Utilities/Validity';


const AddQuestions = (props) => {

    const [sourceConversionId, setSourceConversionID] = useState("0");
    const [destinationConversionId, setDestinationConversionID] = useState("0");
    const [examID, setSelectedExamID] = useState("0");
    const [studentId, setStudentId] = useState("0");
    const [examIndex, setExamIndex] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [addQuestionResponse, setAddQuestionResponse] = useState();
    const [submitExamResponse, setSubmitExamResponse] = useState();

    //Get the conversion metrics
    let displayUnits;
    let { loading, error, conversions } = props.getConversions;

    if (loading) {
        displayUnits = <option value="0">Loading .. </option>
    } else if (error) {
        displayUnits = <option value="0">Error loading </option>
    }
    else {
        displayUnits = conversions.map(unit => {
            return <option key={unit.conversionId} value={unit.conversionId}>{unit.conversionName}</option>
        })

    }


    //Get the exams list by teachersID
    let displayExams;
    let examsList = props.getexamByTeacherID;

    if (examsList.loading) {
        displayExams = <option value="0">Loading .. </option>

    } else if (examsList.error) {
        displayExams = <option value="0">Error loading </option>
    }
    else {
        //filter exams that are incomplete
        displayExams = examsList.examByTeacherID.filter(inc => !inc.isComplete).map((exam, index) => {
            return <option key={index} value={index}>{exam.examId} - {exam.description}</option>
        })

    }


    //When an exam is selected from the list, the examId and studentId are stored in local state
    const updateExamDetails = (e, selectedExam, selectedStudent) => {
        e.preventDefault();
        setSelectedExamID(selectedExam);
        setStudentId(selectedStudent);
        setExamIndex(e.target.value)
    }

    //Check whether input is number and update on validity - Numeric input field
    const checkForNumber = (e) => {
        e.preventDefault();

        let isValid;
        //to allow backspace
        if (e.target.value === "") {
            setInputValue(e.target.value)
        } else {
            isValid = checkValid(e.target.value, { isNumber: true })
        }

        if (isValid) {
            setInputValue(parseFloat(e.target.value))
        }
    }


    //Add Questions to the exam
    const submitQuestion = (e) => {
        e.preventDefault();

        props.addQuestion({
            variables: {
                questionAdd: {
                    examID,
                    sourceConversionId,
                    destinationConversionId,
                    inputValue
                }
            }
        }).then((res) => setAddQuestionResponse(res.data.addQuestion))
            .catch((err) => setAddQuestionResponse(err.data.addQuestion))

    }


    //Add Questions to the exam
    const submitExam = (e) => {
        e.preventDefault();

        props.submitExamToStudent({
            variables: {
                submitStudent: {
                    "examId": examID,
                    studentId,
                    "teacherId": Number(props.teacherId)
                }
            }
        }).then((res) => updateSubmitExamResponse(res.data.submitToStudent))
            .catch((err) => updateSubmitExamResponse(err.data.submitToStudent))
    }

    //Update states after SubmittoStudent action

    const updateSubmitExamResponse = (status) => {
        setSubmitExamResponse(status);
        setAddQuestionResponse();
    }


    //This is used to reset the form
    const reset = () => {
        setAddQuestionResponse();
        setSubmitExamResponse();
        setInputValue("");
        setDestinationConversionID("0");
        setSourceConversionID("0")
        setSelectedExamID("0");
        setStudentId("0");
        setExamIndex("");
    }


    return (
        <Fragment>
            <h2 className="mb-4">Add Questions</h2>

            {/* Messages to be displayed after addQuestion action */}
            {addQuestionResponse ? <Alert status={"info"} title={'Info'}
                message={"Question added successfully. Click 'Submit To Student' to assign the exam to your student."} />
                :
                addQuestionResponse === false ? <Alert status={"danger"} title={'Something went wrong!'}
                    message={'Could not add the question. Please try again.'} /> : null}

            {/* Message to be displayed after submitToStudent query */}
            {submitExamResponse ? <Alert status={"success"} title={'Success'}
                message={"Exam assigned to student successfully. Please check 'My Reports' for more information."} />
                :
                submitExamResponse === false ? <Alert status={"danger"} title={'Something went wrong!'}
                    message={'Could not submit to student. Please try again.'} /> : null}




            <Form className={"border border-light p-3 clearfix"} onSubmit={submitQuestion}>
                <FormGroup>
                    <Label for="exam" bssize="sm">Select Exam</Label>
                    <Input required type="select" name="select" id="exam" bssize="sm" value={examIndex}
                        onChange={e => updateExamDetails(e, Number(examsList.examByTeacherID[e.target.value]["examId"]),
                            Number(examsList.examByTeacherID[e.target.value]["studentId"]))}>
                        <option value="">---</option>
                        {displayExams}
                    </Input>
                    <Label for="exam" bssize="sm" className={"mb-2 mt-4"}> Assigned to - Student ID {studentId}</Label>
                </FormGroup>

                <Row>
                    <Col>

                        <FormGroup>
                            <Label for="source" bssize="sm">Source Conversion Type</Label>
                            <Input required type="select" name="select" id="source" bssize="sm" value={sourceConversionId}

                                onChange={e => setSourceConversionID(Number(e.target.value))}>

                                <option value="">---</option>
                                {displayUnits}
                            </Input>

                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup>
                            <Label for="dest" bssize="sm">Destination Conversion Type</Label>
                            <Input type="select" name="select" id="dest" bssize="sm" value={destinationConversionId}
                                onChange={e => setDestinationConversionID(Number(e.target.value))}>

                                <option value="-1">---</option>
                                {displayUnits}
                            </Input>
                        </FormGroup>
                    </Col>

                </Row>

                <FormGroup className="pb-5">
                    <Label for="input">Numeric Input Value</Label>
                    <Input required placeholder="Eg. 222" id="input" autoComplete="off"
                        value={inputValue} onChange={e => checkForNumber(e)} />
                </FormGroup>

                <FormGroup className="clearfix">
                    <Button color="muted" onClick={reset} type="button" className="mt-2"> Reset </Button>

                    <Button color="muted" className="btn-md border border-primary float-right mt-2"
                        type="button" disabled={!addQuestionResponse && submitExamResponse} onClick={submitExam}> Submit To Student </Button>

                    <Button color="primary" className="mr-3 mt-2 float-right" type="submit"
                        disabled={(sourceConversionId === "0") || (destinationConversionId === "0")
                            || (examID === "0") || addQuestionResponse}> Add Question </Button>
                </FormGroup>
            </Form>

        </Fragment>
    )
}




export default compose(graphql(getConversions, { name: "getConversions" }),
    graphql(addQuestion, { name: "addQuestion" }),
    graphql(submitExamToStudent, { name: "submitExamToStudent" }),
    graphql(getexamByTeacherID, {
        name: "getexamByTeacherID",
        options: (props) => {
            return {
                variables: {
                    teacherID: Number(props.teacherId)
                }
            }
        }
    })

)(AddQuestions);
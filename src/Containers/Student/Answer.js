//About - This is the component to add questions by clicking 'add questions' button in Exams list under /create-exam page
//Program Heirarchy App.js > CreateExam > ExamList >AddQuestionsModal
///////////////////////////////////////////////////////////////////////////////////////////////////

import React, { useState, Fragment } from 'react';

//graphql
import { graphql, compose } from 'react-apollo';
import { getexamByUserID, examQuestionsByExamID, addAnswer, submitExamToTeacher } from '../../Services/Exam/examService';
import { teacherByID, studentByID } from '../../Services/User/userService';
import { addReports } from '../../Services/Report/reportService';

//Styling
import { Row, Col, Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, ModalFooter } from 'reactstrap';

//Components
import { checkValid } from '../../Utilities/Validity';
import Spinner from '../../Components/Spinner';
import Alert from '../../Components/AlertBox';


const Answer = (props) => {

    const [answerByStudent, setAnswerByStudent] = useState("");
    const [eachAnswerResponse, setEachAnswerResponse] = useState([{}]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [submitExamLoading, setSubmitExamLoading] = useState();
    const [addReportStatus, setAddReportStatus] = useState(false);


    let { loading, error, examQuestions } = props.examQuestionsByExamID


    //submit answers

    const answerSubmission = (e, questId) => {
        e.preventDefault();
        props.addAnswer({
            variables: {
                answerAdd: {
                    "examQuestionId": questId,
                    "answer": parseFloat(answerByStudent)
                }
            }
        }).then((res) => updateAnswerSubmission(questId, res.data.addAnswer))
            .catch((err) => updateAnswerSubmission(questId, err.data.addAnswer))
    }

    //update answer submission for UI representation of the answerSubmission() status 
    //BUTTONS state will change according to this update - Ref line 141

    const updateAnswerSubmission = (questId, status) => {
        var res = { "id": questId, "status": status }
        setEachAnswerResponse([...eachAnswerResponse, res])
    }




    //Check whether input is number and update on validity - Numeric input field
    const checkForNumber = (e) => {
        e.preventDefault();

        setCurrentIndex(Number(e.currentTarget.dataset.id))

        let isValid

        if (e.target.value === "") {
            setAnswerByStudent(e.target.value)
        } else {
            isValid = checkValid(e.target.value, { isNumber: true })
        }
        if (isValid) {
            setAnswerByStudent(e.target.value)
        }
    }


    //The exam will be submitted to teacher and added in the teachers report

    const submitExam = (e) => {
        e.preventDefault();

        setSubmitExamLoading(true);

        props.submitExamToTeacher({
            variables: {
                submitTeacher: {
                    "examId": Number(props.examID),
                    "studentId": Number(props.studentId)
                }
            }

        }).then((res) => addReports(res.data.submitToTeacher))
            .catch(() => setSubmitExamLoading(false))
    }

    //Add Report - this function is called in the background to add report after submission of exams
    //is successful

    const addReports = (report) => {
        reset()
        let reportData = {
            report: []
        };

        let teacher = props.teacherByID.teacherByID;
        let student = props.studentByID.studentByID;

        report.map(item =>
            reportData.report.push({
                "examId": item.examId,
                "studentID": Number(props.studentId),
                "examDescription": props.description,
                "examDate": item.examDate,
                "inputUnitOfMeasure": item.inputUnitOfMeasure,
                "inputValue": item.inputValue,
                "isCorrect": item.isCorrect,
                "outPutUnitOfMeasure": item.outPutUnitOfMeasure,
                "studentName": student.firstName + ' ' + student.lastName,
                "studentResponse": item.studentResponse,
                "teacherName": teacher.firstName + ' ' + teacher.lastName
            })
        )

        props.addReports({
            variables: {
                "forms": reportData.report
            }
            ,refetchQueries: () => [{ query: getexamByUserID, variables: { userID: Number(props.studentId) } }]
        }).then((res) => setAddReportStatus(res.data.addReports))
            .catch((err) => setAddReportStatus(err.data.addReports))
    }


    //Reset local form fields when add to report is in process

    const reset = () => {
        setAnswerByStudent("")
        setEachAnswerResponse([{}])
        setCurrentIndex(0)
    }


    return (

        <Modal isOpen={props.modalState}>

            <Row className="border-bottom-light">
                <Col>
                    <ModalHeader className="border-0">Exam ID : {props.examID}</ModalHeader>
                </Col>
                <Col>
                    <Button color="muted" onClick={props.toggleQuestionsModal} aria-label="Close"
                        className="float-right font-weight-bold btn-sm mt-2 mr-2">X</Button>
                </Col>
            </Row>

            {/* Messages to be displayed after if report successfully added*/}
            {addReportStatus ? <Alert status={"success"} title={'Success'}
                message={"Your submission has been successful"} />
                : null}

            {/* Messages to be displayed submit to teacher is unsuccessful */}

            {setSubmitExamLoading === false ? <Alert status={"danger"} title={'Something went wrong!'}
                message={'Could not submit your exam.'} /> : null}


            {/* load spinner when the exam is submitting */}

            {submitExamLoading && !addReportStatus ? <Spinner /> :

                <Fragment>
                    <p style={{ fontSize: '11px' }} className="pt-4 pl-4 pb-0">
                        Guidelines: Submit your answers by clicking 'Add' before submitting to teacher.
                        </p>


                    <ModalBody className={"pr-4 pl-4"}>

                        {
                            loading ? <p className="mt-3">loading data.. </p> :
                                error ? <p className="mt-3">There was a problem while your fetching data.</p> :

                                    examQuestions.map((item, index) =>
                                        <Form className="mb-3" key={index} onSubmit={(e) => answerSubmission(e, item.examQuestionId)}>


                                            <FormGroup>
                                                <h5>Convert {item.inputValue} {item.sourceConversionName} to {item.destinationConversionName} </h5>
                                            </FormGroup>

                                            <Row>
                                                <Col xs={9}>
                                                    <FormGroup>
                                                        <Label for="input">Answer</Label>
                                                        <Input required placeholder="Numeric value eg. 22" id="input" autoComplete="off"
                                                            data-id={index} value={currentIndex === index ? answerByStudent : ""}
                                                            onChange={e => checkForNumber(e)} />
                                                    </FormGroup>

                                                </Col>

                                                <Col style={{ alignSelf: 'flex-end' }}>

                                                    {/* dynamic button rendering */}

                                                    {eachAnswerResponse[eachAnswerResponse.findIndex(x => x.id === item.examQuestionId)] && currentIndex === index ?

                                                        eachAnswerResponse[eachAnswerResponse.findIndex(x => x.id === item.examQuestionId)]["status"] ?

                                                            <FormGroup >
                                                                <Button color="success" className="btn-sm mb-1" disabled={true}>
                                                                    Done
                                                    </Button>
                                                            </FormGroup>
                                                            :

                                                            <FormGroup >
                                                                <Button color="danger" className="btn-sm mb-1" type="submit">
                                                                    Try again
                                                </Button>
                                                            </FormGroup>
                                                        :

                                                        <FormGroup>
                                                            <Button color="primary" type="submit" className="btn-sm">
                                                                Add
                                        </Button>
                                                        </FormGroup>}

                                                </Col>

                                            </Row>

                                        </Form>)}


                        <ModalFooter className={"clearfix"}>
                            <p style={{ fontSize: '11px' }}>
                                Guidelines: Submit your answers by clicking 'Add' before submitting to teacher.
                                     </p>

                            <Button color="muted" className="mr-4 btn-sm border border-primary float-right"
                                type="button" onClick={submitExam}> Submit To Teacher </Button>

                        </ModalFooter>

                    </ModalBody>
                </Fragment>
            }
        </Modal>
    )
}


export default compose(
    graphql(addAnswer, { name: "addAnswer" }),
    graphql(submitExamToTeacher, { name: "submitExamToTeacher" }),
    graphql(addReports, { name: "addReports" }),
    graphql(examQuestionsByExamID, {
        name: "examQuestionsByExamID",
        options: (props) => {
            return {
                variables: {
                    examID: Number(props.examID)
                }
            }
        }
    }),
    graphql(teacherByID, {
        name: "teacherByID",
        options: (props) => {
            return {
                variables: {
                    userID: Number(props.teacherId)
                }
            }
        }
    }),
    graphql(studentByID, {
        name: "studentByID",
        options: (props) => {
            return {
                variables: {
                    userID: Number(props.studentId)
                }
            }
        }
    }),
)(Answer);
        //About - This is the component to add questions by clicking 'add questions' button in Exams list under /create-exam page.
        //Teachers can select the question, add it to exams then assign it to the student.
        //Program Heirarchy App.js > Teacher.js > Dashboard 
        ///////////////////////////////////////////////////////////////////////////////////////////////////

        import React, { useState, Fragment } from 'react';

        //Styling
        import { Container, Row, Col, Button, Form, FormGroup, Label, Input } from 'reactstrap';

        //graphql
        import { graphql, compose } from 'react-apollo';
        import {  getConversions, getexamByTeacherID, getexamByUserID, addQuestion, submitExamToStudent
        } from '../../../Services/Exam/examService';

        //components
        import Alert from '../../../Components/AlertBox';
        import QuestionList from './QuestionsList';
        import { examQuestionsByExamID } from '../../../Services/Exam/examService';
        import { checkValid } from '../../../Utilities/Validity';
        import Spinner from '../../../Components/Spinner';


        const AddQuestions = (props) => {

            const [sourceConversionId, setSourceConversionID] = useState("");
            const [destinationConversionId, setDestinationConversionID] = useState("");
            const [examID, setSelectedExamID] = useState("0");
            const [studentId, setStudentId] = useState("0");
            const [examIndex, setExamIndex] = useState("");
            const [inputValue, setInputValue] = useState("");
            const [addQuestionResponse, setAddQuestionResponse] = useState();
            const [submitExamResponse, setSubmitExamResponse] = useState();
            const [description, setDescription] = useState();
            const [loadQuestionsList, setLoadQuestionsList] = useState(false);
            const [loadingState, setLoadingState] = useState(false);

            //Get the conversion metrics
            let displayUnits;
            let { loading, error, conversions } = props.getConversions;

            if (loading) {
                displayUnits = <option value="">Loading .. </option>
            } else if (error) {
                displayUnits = <option value="">Error loading </option>
            }
            else {
                displayUnits = conversions.map(unit => {
                    return <option key={unit.conversionId} value={unit.conversionId}>{unit.conversionName}</option>
                })

            }


            //Get the exams list by teachersID
            let displayExams;
            let filterExams;
            let examsList = props.getexamByTeacherID;

            if (examsList.loading) {
                displayExams = <option value="">Loading .. </option>

            } else if (examsList.error) {
                displayExams = <option value="">Error loading </option>
            }
            else {
                //filter exams that are incomplete
                filterExams = examsList.examByTeacherID.filter(inc => !inc.isComplete);

                displayExams = filterExams.map((exam, index) => {
                    return <option key={exam.examId} value={index} >{exam.examId} - {exam.description}</option>
                })

            }


            //When an exam is selected from the list, the examId and studentId are stored in local state
            const updateExamDetails = (e) => {
                e.preventDefault();

                let selectedIndex =e.target.value;
                setSelectedExamID(filterExams[selectedIndex].examId);
                setStudentId(filterExams[selectedIndex].studentId);
                setDescription(filterExams[selectedIndex].description);
                setExamIndex(selectedIndex);
                
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


            //Add Questions to the exam, if response is successful call examQuestionsByExamID to refresh the list
            const submitQuestion = (e) => {
                e.preventDefault();

                setLoadingState(true)

                props.addQuestion({
                    variables: {
                        questionAdd: {
                            examID,
                            sourceConversionId,
                            destinationConversionId,
                            inputValue
                        }
                    }, refetchQueries: () => [{ query: examQuestionsByExamID, variables: { examID: Number(examID) } }]
                }).then((res) => setAddQuestionResponse(res.data.addQuestion), setLoadingState(false))
                    .catch((err) => setAddQuestionResponse(err.data.addQuestion), setLoadingState(false))

            }


            //Submit Exam to the student, the student will have refreshed exams by refetchQueries
            const submitExam = (e) => {
                e.preventDefault();

                setLoadingState(true)

                props.submitExamToStudent({
                    variables: {
                        submitStudent: {
                            "examId": examID,
                            studentId,
                            description,
                            "teacherId": Number(props.teacherId)
                        }
                    }, refetchQueries: () => [{ query: getexamByUserID, variables: { userID: Number(studentId) } }]
                }).then((res) => updateSubmitExamResponse(res.data.submitToStudent), setLoadingState(false))
                 .catch((err) => updateSubmitExamResponse(err.data.submitToStudent), setLoadingState(false))
            }

            //Update states after SubmittoStudent action

            const updateSubmitExamResponse = (status) => {
                setSubmitExamResponse(status);
                setAddQuestionResponse();
            }


            //This is used to reset the form
            const reset = () => {
                setLoadingState(false);
                setAddQuestionResponse();
                setSubmitExamResponse();
                setInputValue("");
                setDestinationConversionID("0");
                setSourceConversionID("0")
                setSelectedExamID("0");
                setStudentId("0");
                setExamIndex("");
            }

            //This is to toggle between show and Hide Added Questions List
            const toggleComponents = () => {
                setLoadQuestionsList(prevState => !prevState);
            }

            return (
                <Fragment>
                    <Container className="mt-3 mb-5 mr-2">
                        <h2 className="mb-4">Add Questions</h2>

                        <Row>

                            <Col md="8">
                                {/* Messages to be displayed after addQuestion action */}
                                {addQuestionResponse ? <Alert status={"info"} title={'Info'}
                                    message={"Question added successfully. Click 'Submit To Student' to assign the exam to your student, or continue to 'Add Additional Questions'."} />
                                    :
                                    addQuestionResponse === false ? <Alert status={"danger"} title={'Something went wrong!'}
                                        message={'Could not add the question. Please try again.'} /> : null}

                                {/* Message to be displayed after submitToStudent query */}
                                {submitExamResponse ? <Alert status={"success"} title={'Success'}
                                    message={"Exam assigned to student successfully. Please check 'My Reports' for more information."} />
                                    :
                                    submitExamResponse === false ? <Alert status={"danger"} title={'Something went wrong!'}
                                        message={'Could not submit to student. Please try again.'} /> : null}


                                { loadingState ? <Spinner /> : 

                                <Form className={"border border-light p-3 clearfix"} onSubmit={submitQuestion}>
                                    <FormGroup>
                                        <Label for="exam" bssize="sm">Select Exam</Label>

                                        <Input required type="select" name="select" id="exam" bssize="sm" value={examIndex}
                                            onChange={e => e.target.value=== "" ? null : updateExamDetails(e)}>
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

                                                    onChange={e => e.target.value=== "" ? null : setSourceConversionID(Number(e.target.value))}>

                                                    <option value="">---</option>
                                                    {displayUnits}
                                                </Input>

                                            </FormGroup>
                                        </Col>
                                        <Col>
                                            <FormGroup>
                                                <Label for="dest" bssize="sm">Destination Conversion Type</Label>
                                                <Input type="select" name="select" id="dest" bssize="sm" value={destinationConversionId}
                                                    onChange={e => e.target.value=== "" ? null : setDestinationConversionID(Number(e.target.value))}>

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
                                        <Button color="secondary" onClick={reset} type="button" className="mt-2"> Add More Questions </Button>

                                        <Button color="muted" className="btn-md border border-primary float-right mt-2"
                                            type="button" disabled={!addQuestionResponse && submitExamResponse} onClick={submitExam}> Submit To Student </Button>

                                        <Button color="primary" className="mr-3 mt-2 float-right" type="submit"
                                            disabled={(sourceConversionId === "") || (destinationConversionId === "")
                                                || (examID === "0") || addQuestionResponse}> Add Question </Button>
                                    </FormGroup>
                                </Form>
                                }

                                <p className={"mt-5 mb-5"} style={{ color: "#007bff", textAlign: 'left', cursor: 'pointer' }} onClick={toggleComponents} >
                                    {loadQuestionsList ? "Hide Questions List" : "Show Questions List"}
                                </p>

                            </Col>
                        </Row>

                        {/* show list of questions added */}

                        {loadQuestionsList ? <QuestionList examID={examID} /> : null}

                    </Container>
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
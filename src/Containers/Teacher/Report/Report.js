//About - Fetches students and based on the selected studentId, the exams list is filtered for display
//sends the selected student Id and examId to ReportTable.js
//Program Heirarchy App.js > Dahboard 
///////////////////////////////////////////////////////////////////////////////////////////////////

import React, {Fragment, useState} from 'react';

//graphql
import { graphql, compose } from 'react-apollo';

import{ getExams} from '../../../Services/Exam/examService';
import {getStudents} from '../../../Services/User/userService';
 
//styling
import { Container, Form, FormGroup, Label, Input, Row, Col } from 'reactstrap';

//components
import ReportTable from './ReportTable'


const Report = (props) => {

        const [studentId, setStudentId] = useState();
        const [examId, setExamId] = useState();


        //students list dropdown
        let displayStudents;
        let studentData = props.getStudents;

        if(studentData.loading){
            displayStudents = <option>Loading .. </option>
        } else if(studentData.error){
            displayStudents = <option>Error Loading</option>
        }   
        else {
            displayStudents = studentData.students.map( student => {
            return <option key={student.userId} value={student.userId}>{student.firstName} {student.lastName}</option>
            })
        }


        //Get the exams list by teachersID
        let displayExams;    
        let examsList = props.getExams;

        if( examsList.loading ){
            displayExams = <option>Loading .. </option>
            
        } else if(examsList.error){
            displayExams = <option>Error loading </option>
            }
        else{
            //filter exams that are incomplete
            displayExams =  examsList.exams.filter( inc => inc.studentId === studentId).map((exam, index)=> {
            return <option key={index} value={exam.examId}>{exam.examId} - {exam.description}</option>
            })
        }

            //When an exam is selected from the list, the examId and studentId are stored in local state
            const updateExamDetails = (e, selectedExam) =>{
                e.preventDefault();
                setExamId(selectedExam);
            }
    

    return(

        <Fragment>
                <Container className="mt-5 mr-2 mb-5"> 
    
                     <Row className="justify-content-left">
                        <Col md="6 p-0">
                             <h2 className="ml-2 mb-4 mr-2">View Reports</h2> 

                            <Form>
                                <Col>
                                    <FormGroup>
                                        <Label for="studentsSelect">First: Select student</Label>
                                        <Input type="select" name="select" id="studentsSelect" value={studentId}
                                         onChange={(e) => e.target.value === 0 ? null : setStudentId(Number(e.target.value))}>
                                                <option value="0">Select Student</option>
                                                    {displayStudents}
                                        </Input>
                                    </FormGroup>                       
                                </Col>
                                
                                 <Col>
                                    <FormGroup>
                                        <Label for="exam" bssize="sm">Next: Select exam assigned to the student</Label>
                                        <Input required type="select" name="select" id="exam" bssize="sm" value={examId}
                                                onChange={e => e.target.value === "" ? null :
                                                updateExamDetails(e , Number(e.target.value))}>

                                                    <option value="">---</option>  
                                                    {studentId &&  displayExams}  
                                        </Input>
                                    </FormGroup>
                                 </Col> 

                                </Form>
                             </Col>
                        </Row>

                        <Row className="justify-content-center mt-5">
                             <Col>
                                {studentId && examId && <ReportTable userID={Number(studentId)} examID={examId} teacherId={props.teacherId}/>}
                             </Col>
                        </Row>


                    {/* Report Table */}

                   

                       
                </Container>
        </Fragment>
    )
}

export default compose(graphql(getStudents, {name: "getStudents"}),
                         graphql(getExams, {name: "getExams"})

)(Report);
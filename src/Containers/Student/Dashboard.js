//About - this is the table that contains the list of exams that the teacher has created.
//Students can select exam and answer the assigned questions.
//This is the dashboard for the studens (Ref PageRoutes/Routes)
///////////////////////////////////////////////////////////////////////////////////////////////////

import React, { useState, Fragment } from 'react';

//graphql
import { graphql, compose } from 'react-apollo';
import { getexamByUserID } from '../../Services/Exam/examService';


//styling
import { Table, Container, } from 'reactstrap';

//components
import Answer from './Answer';

const ExamList = (props) => {

    //state
    const [selectedExamId, setSelectedExamId] = useState();
    const [modalState, setmodalState] = useState(false);
    const [teacherId, setTeacherId] = useState(false);
    const [examDescription, setExamDescription] = useState(false);

    //array for displaying table
    const examListHeader = ['Student Id', 'Teacher', 'Exam ID', 'Description', 'Date Created', 'Complete', 'Graded', 'Action'];
    const displayList = ['studentId', 'teacherId', 'examId', 'description', 'dateCreated', 'isComplete', 'isGraded'];

    let { loading, error, examByUserID } = props.getexamByUserID;

    //set examID in a state so that it can be passed to the modal and open the modal
    const updateSelect = (e, selectedExam, description ,teacher) => {
        e.preventDefault()
        setSelectedExamId(selectedExam)
        setTeacherId(teacher)
        setExamDescription(description)
        toggleQuestionsModal()
    }

    //function to toggle the closing and opening of the modal at every true state
    const toggleQuestionsModal = () => {
        setmodalState(prevState => (!prevState))
    }

    return (

        <Fragment>
            <Container className="mt-5 mr-2 mb-5">
                <h2 className="mb-4"> Pending Exams </h2>


                {loading ? <p className="mt-3">loading data.. </p> :
                    error ? <p className="mt-3">There was a problem while your fetching data.</p> :

                        <Table className="table-responsive table-hover striped">
                            <thead>
                                <tr>
                                    {examListHeader.map((title, index) =>
                                        <th scope="col" key={index}>{title}</th>)}
                                </tr>
                            </thead>

                            <tbody >
                                {examByUserID.filter(inc => !inc.isComplete).map((rowItems, rowIndex) =>
                                    <tr key={rowIndex}>
                                        {displayList.map((column, colIndex) =>
                                            <td key={colIndex}>{rowItems[column]}</td>)}

                                        <td>
                                            <button type="button" className="btn-sm btn-Light btn-hover"
                                                onClick={(e) => updateSelect(e, examByUserID[rowIndex]["examId"],
                                                        examByUserID[rowIndex]["description"],
                                                        examByUserID[rowIndex]["teacherId"])}>
                                                Start
                                            </button>
                                        </td>
                                    </tr>)}
                            </tbody>

                        </Table>}
            </Container>


            {modalState && 
                    <Answer modalState={modalState} examID={selectedExamId} studentId={props.match.params.student}
                      description={examDescription} teacherId={teacherId} toggleQuestionsModal={toggleQuestionsModal} />}
        </Fragment>
    )
}

export default compose(
    graphql(getexamByUserID, {
        name: "getexamByUserID",
        options: (props) => {
            return {
                variables: {
                    userID: Number(props.match.params.student)
                }
            }
        }
    }))(ExamList);
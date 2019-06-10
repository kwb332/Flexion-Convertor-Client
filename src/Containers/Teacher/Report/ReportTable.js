//About - Fetches students and based on the selected studentId, the exams list is filtered for display
//sends the selected student Id and examId to ReportTable
//Program Heirarchy App.js > Dashboard > Report
////////////////////////////////////////////////////////////////////////////////////////////


import React, {Fragment} from 'react';

//Styling
import { Table} from 'reactstrap';

//graphql
import { graphql, compose } from 'react-apollo';
import{ reportByExamID } from '../../../Services/Report/reportService';


const ReportTable = (props) => {

    //array for displaying table
        const reportListHeader = ['Exam ID', 'Exam Date','Student ID', 'Student Name', 'Description','Input Unit',
                    'Output Unit', 'Student Response', 'isCorrect','Teacher Name'];

    //to filter from result array
        const displayList = ['examId', 'examDate' , 'studentID', 'studentName', 'examDescription',
                'inputUnitOfMeasure', 'outPutUnitOfMeasure', 'studentResponse', "isCorrect", 'teacherName' ];
       
        let {loading, error, reportByExamID } = props.reportByExamID;

    return(
        <Fragment>

                        <div style={{background: '#efefef', display:'inline-block'}}>
                                <h5 style={{margin: '0'}}> Exams Created by teacher ID - {props.teacherId} </h5>
                        </div>
                
                        { loading ? <p className="mt-3">loading data.. </p> :
                        error ? <p className="mt-3">There was a problem while your fetching data.</p> :

                            <Table className="table-responsive table-hover">
                                <thead className="thead-dark">
                                    <tr>
                                        {reportListHeader.map((title, index) =>
                                        <th scope="col" className="pl-1" key={index}>{title}</th> )}
                                    </tr>
                                </thead>

                                <tbody >
                                        {reportByExamID.filter(i => i.studentID === props.userID ).map((rowItems, rowIndex) =>

                                            rowItems ===  null ? ' ': 

                                            <tr key={rowIndex}>
                                                 
                                                {displayList.map((column, colIndex) =>
                                                
                                                <td key={colIndex}>{String(rowItems[column])}</td>)}
                                            </tr>   
                                        )}
                                </tbody>

                            </Table>  
                        }
        </Fragment>

    )
}

export default compose(
                         graphql(reportByExamID, {
                            name: "reportByExamID",
                            options: (props) => {
                                return {
                                    variables: {
                                        examID: Number(props.examID)
                                    }
                                }
                            }
                        })
                        )(ReportTable);
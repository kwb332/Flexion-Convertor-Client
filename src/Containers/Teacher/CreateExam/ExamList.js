//About - Fetches students and based on the selected studentId, the exams list is filtered for display
//sends the selected student Id and examId to ReportTable
//Program Heirarchy App.js > Dashboard > Report
////////////////////////////////////////////////////////////////////////////////////////////


import React, {Fragment} from 'react';

//Styling
import { Table} from 'reactstrap';

//graphql
import { graphql, compose } from 'react-apollo';
import { getexamByTeacherID } from '../../../Services/Exam/examService';


const ExamList = (props) => {

    //array for displaying table
        const reportListHeader = ['Exam Id','Exam Description','student Id', 'Complete']

    //to filter from result array
        const displayList = ['examId','description' , 'studentId', 'isComplete'];
       
        
         let { loading, error, examByTeacherID } = props.getexamByTeacherID

    return(
        <Fragment>

                        <div style={{background: '#efefef', display:'inline-block'}}>
                                <h5 style={{margin: '0'}}> Exams Created by Teacher ID - {props.teacherId} </h5>
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
                                        {examByTeacherID.map((rowItems, rowIndex) =>

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
                        )(ExamList);
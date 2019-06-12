//About - This is the main landing page for the teacher's section
//Nav is to toggle between create-exam, answer and report.
// Redux is not implement in this project. Hence teacherId cannot be stored
// in the application at global access level
////////////////////////////////////////////////////////////////


import React, { useState, useEffect, Fragment } from 'react';


//components 
import SideNav from './SideNav';
import AddQuestions from './AddQuestions/AddQuestions';
import Exam from './CreateExam/Exam';
import Report from './Report/Report';


const Dashboard = (props) => {

    const [tab, setTab] = useState("Create Exam")
    const [teacherId, setTeacherId] = useState("0")

    useEffect(() => {
        setTeacherId(Number(props.match.params.teacher));
    }, [props.match.params.teacher]);


    const changeTab = (tabName) => {
        setTab(tabName)
    }


    return (
        <Fragment>
            <SideNav changeTab={changeTab} currentTab={tab} />

             {tab === "Create Exam" ? 
                <Exam teacherId={teacherId} /> 
                :
                tab === "Add Questions" ?
                    <AddQuestions teacherId={teacherId} />
                    : 

                    <Report teacherId={teacherId} />} 
        </Fragment>
    )
}

export default Dashboard

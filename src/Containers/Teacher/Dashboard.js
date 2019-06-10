//About - This is the main landing page for the teacher's section
//Nav is to toggle between create-exam and report
////////////////////////////////////////////////////////////////


import React, { useState, useEffect, Fragment } from 'react';


//components 
import SideNav from './SideNav';
import Exam from './Exam';
import Report from './Report/Report';


const Dashboard = (props) => {

    const [tab, setTab] = useState("exam")
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
            {tab === "exam" ? <Exam teacherId={teacherId} /> : <Report teacherId={teacherId} />}
        </Fragment>
    )
}

export default Dashboard

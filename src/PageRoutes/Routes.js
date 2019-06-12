// About - This is the routes hub, all routes/page navigations with its respective components are stored
// This component is linked to App.js
////////////////////////////////////////////////////////////////////////////////////////////////////////

import React, { lazy, Suspense } from 'react';

import { Route, Switch, withRouter } from 'react-router-dom';

//components
import Login from '../Containers/Login';
import TeacherDashboard from '../Containers/Teacher/Dashboard';
import StudentDashboard from '../Containers/Student/Dashboard';
import Spinner from '../Components/Spinner';



//These components will be loaded async on-deman (code-splitting)

const AsyncTeacher = lazy(() => import('../Containers/Teacher/Teachers'));
const AsyncStudent = lazy(() => import('../Containers/Student/Student'));


const AppRoutes = (props) => {

    return (
        <Suspense fallback={<div><Spinner /></div>}>
            <Switch>
                <Route path="/student/:student/dashboard" component={StudentDashboard} />
                <Route path="/teacher/:teacher/dashboard" component={TeacherDashboard} />
                <Route path="/student" component={AsyncStudent} />
                <Route path="/teacher" component={AsyncTeacher} />
                <Route path="/" component={Login} />
            </Switch>
        </Suspense>
    )
}

export default withRouter(AppRoutes);
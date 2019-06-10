//About - reusable component to show alerts.
/////////////////////////////////////////////////

import React, {Fragment} from 'react';
import { Alert } from 'reactstrap';

const AlertBox = (props) => {
  return (
    <Fragment>
        <Alert color={props.status} className="mt-3 p-2 pl-3">
                <h5 className="alert-heading">{props.title}</h5>
                <p className="mb-2">
                    {props.message}
                </p>
        </Alert>
    </Fragment>
  );
};

export default AlertBox;
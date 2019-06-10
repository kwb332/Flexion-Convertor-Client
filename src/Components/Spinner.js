
import React from 'react';
import { Spinner } from 'reactstrap';

const Loader = () => {
    return (
      <div style={{height: '300px'}}>
        <Spinner color="secondary" size="lg" style={{ width: '3rem', height: '3rem',
                             position: 'absolute', top:'50%', left: '45%' }}/>
      </div>
    );
  }

export default Loader;
import React, { useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import awsconfig from './src/aws-exports'; 
import AppNavigator from './src/navigation/AppNavigator';


const App = () => {
    useEffect(() => {
        Amplify.configure(awsconfig);
    }, []); 

    return <AppNavigator />;
};

export default App;

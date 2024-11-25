'use client'

import React from 'react';
import SignUpForm from './components/SignupForm';

const SignupPage = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full w-full min-h-[80vh]">
            <SignUpForm />
        </div>
    );
};

export default SignupPage;

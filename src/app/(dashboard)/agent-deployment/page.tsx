'use client'

import React from 'react';
import AgentDownloadForm from './components/AgentDownloadForm';

const AgentDeploymentPage = () => {
    return (
        <div className="flex flex-col rounded-lg items-center justify-center p-6">
            <AgentDownloadForm />
        </div>
    );
};

export default AgentDeploymentPage;

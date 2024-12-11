// src/components/dashboard/Description.jsx
import React from 'react';

const Description = ({ description, onDescriptionChange }) => {
    return (
        <div>
            <textarea
                value={description}
                onChange={(e) => onDescriptionChange(e.target.value)}
                placeholder="Enter project description..."
                className="w-full h-64 p-4 rounded-md border"
            />
        </div>
    );
};

export default Description;
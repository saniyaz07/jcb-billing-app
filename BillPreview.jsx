// BillPreview.jsx

import React from 'react';
import './BillPreview.css';

const BillPreview = () => {
    return (
        <div className="bill-preview">
            {/* Bill content goes here */}
            <div className="bill-content">
                <h1>Bill Preview</h1>
                {/* Insert bill details */}
            </div>
            <div className="no-print">
                {/* Navigation buttons and sidebar elements */}
                <button>Print</button>
                <button>Download PDF</button>
                {/* Sidebar component */}
            </div>
        </div>
    );
};

export default BillPreview;

/* BillPreview.css */

@media print {
    .no-print {
        display: none;
    }
    .bill-preview {
        width: 100%;
        height: auto;
    }
    .bill-content {
        page-break-after: always;
    }
    /* Additional styling to ensure all content fits within a single A4 page */
}
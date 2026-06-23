import React, { useState } from 'react';
import { db } from '../database/db';
import toast from 'react-hot-toast';

const ExportData: React.FC = () => {
    const [exporting, setExporting] = useState(false);

    const exportToCSV = async (data: any[], filename: string) => {
        if (!data.length) { toast.error(`No ${filename} data`); return false; }
        const headers = Object.keys(data[0]);
        const csvRows = [headers.join(',')];
        for (const row of data) {
            const values = headers.map(header => JSON.stringify(row[header] || ''));
            csvRows.push(values.join(','));
        }
        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        return true;
    };

    const handleExportAll = async () => {
        setExporting(true);
        toast.loading('Preparing export...', { id: 'export' });
        const patients = await db.patients.toArray();
        const incidents = await db.incidentLogs.toArray();
        const contacts = await db.emergencyContacts.toArray();
        let exported = 0;
        if (await exportToCSV(patients, 'patients')) exported++;
        if (await exportToCSV(incidents, 'incidents')) exported++;
        if (await exportToCSV(contacts, 'emergency_contacts')) exported++;
        toast.success(`Exported ${exported} files!`, { id: 'export' });
        setExporting(false);
    };

    return (
        <button className="dropdown-item" onClick={handleExportAll} disabled={exporting}>
            <i className={`bi ${exporting ? 'bi-hourglass-split' : 'bi-filetype-csv'} me-2`}></i>
            {exporting ? 'Exporting...' : 'Export All Data (CSV)'}
        </button>
    );
};

export default ExportData;
import jsPDF from 'jspdf';

interface IncidentExportRow {
    id: number;
    incident_timestamp: string;
    severity: string;
    description: string;
    patient?: { full_name: string };
    topic?: { title: string };
}

/** Escapes a value for safe inclusion in a CSV cell. */
function csvCell(value: string): string {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
}

export function exportIncidentsToCSV(incidents: IncidentExportRow[]) {
    const headers = ['ID', 'Date', 'Patient', 'Emergency Type', 'Severity', 'Description'];
    const rows = incidents.map(i => [
        String(i.id),
        new Date(i.incident_timestamp).toLocaleString(),
        i.patient?.full_name || 'Unknown',
        i.topic?.title || 'Unspecified',
        i.severity,
        i.description || '',
    ].map(csvCell).join(','));

    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `incident-report-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
}

export function exportIncidentsToPDF(
    incidents: IncidentExportRow[],
    stats: { incidents: number; patients: number; contacts: number; facilities: number }
) {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.getHeight();
    let y = 20;

    doc.setFontSize(16);
    doc.setTextColor(220, 53, 69);
    doc.text('Usaidizi Pap! — Incident Report', 14, y);
    y += 8;

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, y);
    y += 10;

    doc.setTextColor(33, 37, 41);
    doc.setFontSize(11);
    doc.text(`Total Incidents: ${stats.incidents}`, 14, y);
    doc.text(`Total Patients: ${stats.patients}`, 100, y);
    y += 6;
    doc.text(`Emergency Contacts: ${stats.contacts}`, 14, y);
    doc.text(`Facilities: ${stats.facilities}`, 100, y);
    y += 12;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Date', 14, y);
    doc.text('Patient', 55, y);
    doc.text('Type', 100, y);
    doc.text('Severity', 140, y);
    y += 2;
    doc.setLineWidth(0.3);
    doc.line(14, y, 196, y);
    y += 6;
    doc.setFont('helvetica', 'normal');

    incidents.forEach((i) => {
        if (y > pageHeight - 20) {
            doc.addPage();
            y = 20;
        }
        doc.text(new Date(i.incident_timestamp).toLocaleDateString(), 14, y);
        doc.text((i.patient?.full_name || 'Unknown').substring(0, 20), 55, y);
        doc.text((i.topic?.title || 'Unspecified').substring(0, 18), 100, y);
        doc.text(i.severity, 140, y);
        y += 7;
    });

    doc.save(`incident-report-${new Date().toISOString().slice(0, 10)}.pdf`);
}
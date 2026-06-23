import React from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import toast from 'react-hot-toast';

interface ExportPDFProps {
    elementId?: string;
    filename?: string;
}

const ExportPDF: React.FC<ExportPDFProps> = ({ elementId = 'pdf-content', filename = 'incident_report' }) => {
    const generatePDF = async () => {
        toast.loading('Generating PDF...', { id: 'pdf' });
        
        try {
            const element = document.getElementById(elementId);
            if (!element) {
                toast.error('No content to export', { id: 'pdf' });
                return;
            }
            
            const canvas = await html2canvas(element, {
                scale: 2,
                backgroundColor: '#ffffff'
            });
            
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 190;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
            pdf.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`);
            
            toast.success('PDF generated!', { id: 'pdf' });
        } catch (error) {
            console.error('PDF generation failed:', error);
            toast.error('Failed to generate PDF', { id: 'pdf' });
        }
    };

    return (
        <button className="btn btn-sm btn-danger" onClick={generatePDF}>
            <i className="bi bi-filetype-pdf me-1"></i> Export PDF
        </button>
    );
};

export default ExportPDF;
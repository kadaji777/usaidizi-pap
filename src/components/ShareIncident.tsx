import React, { useState } from 'react';
import { IncidentLog } from '../database/db';
import { WhatsappShareButton, FacebookShareButton, TwitterShareButton, EmailShareButton } from 'react-share';
import toast from 'react-hot-toast';

interface ShareIncidentProps { incident: IncidentLog; patientName?: string; }

const ShareIncident: React.FC<ShareIncidentProps> = ({ incident, patientName }) => {
    const [copied, setCopied] = useState(false);
    const shareUrl = window.location.origin;
    const shareText = `EMERGENCY INCIDENT REPORT\nPatient: ${patientName || 'Unknown'}\nSeverity: ${incident.severity.toUpperCase()}\nDescription: ${incident.description.substring(0, 100)}\nDate: ${new Date(incident.incident_timestamp).toLocaleString()}\n---\nSent from Usaidizi Pap! Emergency App`;

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        toast.success('Report copied!');
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="btn-group" role="group">
            <WhatsappShareButton url={shareUrl} title={shareText}>
                <button className="btn btn-sm btn-success"><i className="bi bi-whatsapp"></i></button>
            </WhatsappShareButton>
            <FacebookShareButton url={shareUrl} hashtag="#UsaidiziPap">
                <button className="btn btn-sm btn-primary"><i className="bi bi-facebook"></i></button>
            </FacebookShareButton>
            <TwitterShareButton url={shareUrl} title={shareText}>
                <button className="btn btn-sm btn-info text-white"><i className="bi bi-twitter-x"></i></button>
            </TwitterShareButton>
            <EmailShareButton url={shareUrl} subject="Emergency Incident Report" body={shareText}>
                <button className="btn btn-sm btn-secondary"><i className="bi bi-envelope"></i></button>
            </EmailShareButton>
            <button className="btn btn-sm btn-outline-secondary" onClick={copyToClipboard}>
                <i className={`bi ${copied ? 'bi-check-lg' : 'bi-clipboard'}`}></i>
            </button>
        </div>
    );
};

export default ShareIncident;
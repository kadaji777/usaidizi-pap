import React from 'react';
import PullToRefresh from 'react-simple-pull-to-refresh';

interface PullToRefreshProps {
    onRefresh: () => Promise<void>;
    children: React.ReactNode;
}

const CustomPullToRefresh: React.FC<PullToRefreshProps> = ({ onRefresh, children }) => {
    return (
        <PullToRefresh
            onRefresh={onRefresh}
            pullingContent={
                <div className="text-center py-3">
                    <i className="bi bi-arrow-down text-danger"></i>
                    <span className="ms-2 text-muted">Pull down to refresh</span>
                </div>
            }
            refreshingContent={
                <div className="text-center py-3">
                    <div className="spinner-border spinner-border-sm text-danger me-2" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <span className="text-muted">Refreshing...</span>
                </div>
            }
        >
            {children}
        </PullToRefresh>
    );
};

export default CustomPullToRefresh;
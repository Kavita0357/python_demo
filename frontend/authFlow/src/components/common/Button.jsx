import React from 'react';
export default function Button({ children, loading, className = '', ...props }) { return <button className={`button ${className}`} disabled={loading || props.disabled} {...props}>{loading ? 'Please wait...' : children}</button>; }

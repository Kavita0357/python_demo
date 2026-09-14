import React from 'react';
import { Link } from 'react-router-dom';

export default function FormFooter({ text, linkText, to }) {
  return <p className="auth-footer">{text} <Link to={to}>{linkText}</Link></p>;
}

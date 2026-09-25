import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { leaveService, leaveTypeService } from '../services/leaveService';
import { Badge, formatDate } from './DashboardPage';

export default function LeavesPage() {
  const [leaves,setLeaves]=useState([]), [types,setTypes]=useState([]), [filter,setFilter]=useState(''), [loading,setLoading]=useState(true), [error,setError]=useState('');
  const load=async()=>{setLoading(true);setError('');try{const [a,b]=await Promise.all([leaveService.my(),leaveTypeService.list()]);setLeaves(a);setTypes(b)}catch(e){setError(getError(e))}finally{setLoading(false)}};
  useEffect(()=>{load()},[]);
  const visible=filter?leaves.filter(x=>x.status===filter):leaves;
  return <div className="page">
    <div className="page-title"><div><p className="eyebrow">My leave</p><h1>Leave requests</h1><p>Create, submit and track your leave applications.</p></div><Link className="primary-btn" to="/leaves/new">+ New request</Link></div>
    <div className="toolbar"><select value={filter} onChange={e=>setFilter(e.target.value)}><option value="">All statuses</option><option value="draft">Draft</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option><option value="cancelled">Cancelled</option></select><button className="ghost-btn" onClick={load}>Refresh</button></div>
    {error&&<div className="alert">{error}</div>}
    <section className="panel table-panel">{loading?<div className="empty">Loading requests…</div>:visible.length?<div className="table-wrap"><table><thead><tr><th>Leave type</th><th>Dates</th><th>Days</th><th>Status</th><th>Created</th><th></th></tr></thead><tbody>{visible.map(x=><tr key={x.id}><td><strong>{types.find(t=>t.id===x.leave_type_id)?.name||`Leave #${x.leave_type_id}`}</strong>{x.reason&&<small>{x.reason}</small>}</td><td>{formatDate(x.start_date)} – {formatDate(x.end_date)}</td><td>{x.total_days}</td><td><Badge status={x.status}/></td><td>{formatDate(x.created_at?.slice(0,10))}</td><td><Link className="table-link" to={`/leaves/${x.id}`}>View</Link></td></tr>)}</tbody></table></div>:<div className="empty">No leave requests match this filter.</div>}</section>
  </div>;
}
function getError(e){return e?.response?.data?.detail||e?.message||'Something went wrong.'}

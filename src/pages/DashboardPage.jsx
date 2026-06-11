
// src/pages/Dashboard.jsx
// import React from 'react';
import { Card, Row, Col, Badge } from 'react-bootstrap';
import './DashboardPage.css';
// import { supabase } from '../config/supabase';
// import { useEffect, useState } from 'react';
import { useAuth } from '../context/useAuth';

const DashboardPage = () => {
  const {profile, loading} = useAuth();
  // const [userName, setUserName] = useState("");

  const stats = [
    { title: 'Total Reports', value: '1,284', icon: 'fa-flag', iconClass: 'stat-icon-primary', change: '+12%' },
    { title: 'Pending Review', value: '47', icon: 'fa-clock', iconClass: 'stat-icon-gray', change: '-3%' },
    { title: 'Resolved Cases', value: '892', icon: 'fa-check-circle', iconClass: 'stat-icon-success', change: '+8%' },
    { title: 'Active Investigations', value: '123', icon: 'fa-search', iconClass: 'stat-icon-warning', change: '+5%' },
  ];

  const recentActivities = [
    { id: 1, type: 'Fraud Report', description: 'Suspicious transaction reported', time: '5 mins ago', status: 'Urgent' },
    { id: 2, type: 'Cyber Crime', description: 'Phishing attempt detected', time: '1 hour ago', status: 'Investigating' },
    { id: 3, type: 'Identity Theft', description: 'Fake identity documents', time: '3 hours ago', status: 'Pending' },
    { id: 4, type: 'Money Laundering', description: 'Unusual bank transfers', time: '5 hours ago', status: 'Urgent' },
  ];

  const categories = [
    { name: 'Financial Fraud', percentage: 45, colorClass: 'progress-primary', widthClass: 'progress-w-45' },
    { name: 'Cyber Crime', percentage: 30, colorClass: 'progress-gray', widthClass: 'progress-w-30' },
    { name: 'Identity Theft', percentage: 15, colorClass: 'progress-success', widthClass: 'progress-w-15' },
    { name: 'Other Crimes', percentage: 10, colorClass: 'progress-warning', widthClass: 'progress-w-10' },
  ];

  // Fetch User Name
  // const fetchUserName = async()=>{
  //   if(!user) return;

  //   const { error, data } = await supabase
  //   .from("profiles")
  //   .select("full_name")
  //   .eq("id", user.id)
  //   .single();

  //   if(error){
  //     console.log(error);
  //     setUserName("Unknown User")
  //   }else{
  //     setUserName(data.full_name);
  //   }
  // }

  if(loading || !profile) {
    return null
  }
  // useEffect(()=>{
  //   const fetchUserName = async()=>{
  //     if(!user) return;
  
  //     const { error, data } = await supabase
  //     .from("profiles")
  //     .select("full_name")
  //     .eq("id", user.id)
  //     .single();
  
  //     if(error){
  //       console.log(error);
  //       setUserName("Guest User")
  //     }else{
  //       setUserName(data.full_name);
  //     }
  //   }
  //   fetchUserName();
  // },[user]);

  return (
    <div className="p-0">
      <div className="mb-4">
        <h1 className="h2 mb-2 dashboard-title">Dashboard</h1>
        <p className="text-secondary">Welcome back, <strong>{profile?.full_name || "Guest User"}</strong>. Here's what's happening with your reports today.</p>
      </div>

      <Row className="g-4 mb-4">
        {stats.map((stat, index) => (
          <Col lg={3} md={6} key={index}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="d-flex align-items-center gap-3">
                <div 
                  className={`d-flex align-items-center justify-content-center rounded-3 stat-icon-box ${stat.iconClass}`}
                >
                  <i className={`fas ${stat.icon} fs-3`}></i>
                </div>
                <div>
                  <h3 className="h2 mb-1 fw-bold">{stat.value}</h3>
                  <p className="text-secondary mb-0">{stat.title}</p>
                  <small className={stat.change.includes('+') ? 'stat-change-positive' : 'stat-change-negative'}>
                    {stat.change} from last month
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="g-4">
        <Col lg={7}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0 pt-4 px-4">
              <h5 className="mb-0 fw-semibold">Recent Activities</h5>
            </Card.Header>
            <Card.Body className="px-4">
              {recentActivities.map(activity => (
                <div key={activity.id} className="d-flex gap-3 pb-3 mb-3 border-bottom">
                  <div 
                    className="d-flex align-items-center justify-content-center rounded-2 activity-icon-wrap"
                  >
                    <i className="fas fa-bell activity-icon"></i>
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <strong>{activity.type}</strong>
                      <Badge 
                        bg={activity.status === 'Urgent' ? 'danger' : activity.status === 'Investigating' ? 'warning' : 'secondary'}
                        className="px-2 py-1 rounded-pill"
                      >
                        {activity.status}
                      </Badge>
                    </div>
                    <p className="text-secondary mb-1 small">{activity.description}</p>
                    <small className="text-muted">{activity.time}</small>
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={5}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0 pt-4 px-4">
              <h5 className="mb-0 fw-semibold">Report Categories</h5>
            </Card.Header>
            <Card.Body className="px-4">
              {categories.map((category, idx) => (
                <div key={idx} className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span>{category.name}</span>
                    <span className="text-muted">{category.percentage}%</span>
                  </div>
                  <div className="progress category-progress">
                    <div 
                      className={`progress-bar category-progress-bar ${category.colorClass} ${category.widthClass}`}
                    ></div>
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
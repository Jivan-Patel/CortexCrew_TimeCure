import React from 'react';
import './RoleSelector.css';

export const RoleSelector = ({ selectedRole, onRoleChange }) => {
  return (
    <div className="role-selector-container">
      <label className="role-label">Select Your Role:</label>
      <div className="role-options">
        <div
          className={`role-option doctor ${selectedRole === 'doctor' ? 'active' : ''}`}
          onClick={() => onRoleChange('doctor')}
        >
          <div className="role-icon">👨‍⚕️</div>
          <div className="role-name">Doctor</div>
          <div className="role-description">Healthcare Professional</div>
        </div>

        <div
          className={`role-option patient ${selectedRole === 'patient' ? 'active' : ''}`}
          onClick={() => onRoleChange('patient')}
        >
          <div className="role-icon">👤</div>
          <div className="role-name">Patient</div>
          <div className="role-description">Health Seeker</div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';

export const RoleSelector = ({ selectedRole, onRoleChange }) => {
  return (
    <div className="my-[30px]">
      <label className="block text-base font-semibold mb-[15px] text-[#333]">Select Your Role:</label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
        <div
          className={`p-6 border-2 rounded-[10px] cursor-pointer transition-all duration-300 text-center ${
            selectedRole === 'doctor'
              ? 'border-[#28a745] bg-[#e8f5e9] shadow-[0_5px_15px_rgba(40,167,69,0.3)] transform -translate-y-[5px]'
              : 'border-[#ddd] bg-[#f9f9f9] hover:border-[#007bff] hover:-translate-y-[5px] hover:shadow-[0_5px_15px_rgba(0,123,255,0.2)]'
          }`}
          onClick={() => onRoleChange('doctor')}
        >
          <div className="text-[48px] mb-[10px]">👨‍⚕️</div>
          <div className="text-lg font-semibold text-[#333] mb-[5px]">Doctor</div>
          <div className="text-[13px] text-[#666]">Healthcare Professional</div>
        </div>

        <div
          className={`p-6 border-2 rounded-[10px] cursor-pointer transition-all duration-300 text-center ${
            selectedRole === 'patient'
              ? 'border-[#007bff] bg-[#e3f2fd] shadow-[0_5px_15px_rgba(0,123,255,0.3)] transform -translate-y-[5px]'
              : 'border-[#ddd] bg-[#f9f9f9] hover:border-[#007bff] hover:-translate-y-[5px] hover:shadow-[0_5px_15px_rgba(0,123,255,0.2)]'
          }`}
          onClick={() => onRoleChange('patient')}
        >
          <div className="text-[48px] mb-[10px]">👤</div>
          <div className="text-lg font-semibold text-[#333] mb-[5px]">Patient</div>
          <div className="text-[13px] text-[#666]">Health Seeker</div>
        </div>
      </div>
    </div>
  );
};

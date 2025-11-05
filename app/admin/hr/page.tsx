"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users, UserPlus, Calendar, Clock, Award, TrendingUp, DollarSign,
  Briefcase, FileText, Target, Activity, BarChart3, CheckCircle,
  AlertCircle, Search, Filter, Eye, Edit, Download, Upload
} from "lucide-react";

interface Employee {
  id: string;
  name: string;
  designation: string;
  department: string;
  email: string;
  phone: string;
  joinDate: string;
  status: 'ACTIVE' | 'ON_LEAVE' | 'RESIGNED' | 'TERMINATED';
  salary: number;
  performance: number;
}

export default function HRManagementPage() {
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: 'EMP001',
      name: 'Rajesh Kumar',
      designation: 'Senior Loan Officer',
      department: 'Operations',
      email: 'rajesh@Quikkred.com',
      phone: '+91 98765 43210',
      joinDate: '2022-01-15',
      status: 'ACTIVE',
      salary: 750000,
      performance: 4.5
    }
  ]);

  const stats = {
    totalEmployees: 245,
    activeEmployees: 238,
    onLeave: 7,
    newHires: 12,
    attritionRate: 8.5,
    avgSalary: 650000,
    avgPerformance: 4.2,
    openPositions: 15
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-emerald-500/20 text-emerald-400';
      case 'ON_LEAVE': return 'bg-yellow-500/20 text-yellow-400';
      case 'RESIGNED': case 'TERMINATED': return 'bg-red-500/20 text-red-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-400" />
            HR Management System
          </h1>
          <p className="text-slate-400 mt-1">Employee records, payroll, attendance & performance tracking</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2 gradient-primary text-white rounded-lg"
        >
          <UserPlus className="w-4 h-4" />
          Add Employee
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: Users, label: 'Total Employees', value: stats.totalEmployees, color: 'blue' },
          { icon: CheckCircle, label: 'Active', value: stats.activeEmployees, color: 'emerald' },
          { icon: TrendingUp, label: 'Attrition Rate', value: `${stats.attritionRate}%`, color: 'red' },
          { icon: DollarSign, label: 'Avg Salary', value: `₹${(stats.avgSalary / 100000).toFixed(1)}L`, color: 'purple' }
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-2xl p-6 border border-slate-700"
          >
            <stat.icon className={`w-6 h-6 text-${stat.color}-400 mb-2`} />
            <p className="text-sm text-slate-400">{stat.label}</p>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="glass rounded-2xl border border-slate-700 overflow-hidden">
        <div className="p-4 border-b border-slate-700">
          <h3 className="text-lg font-semibold text-white">Employee Directory</h3>
        </div>
        <table className="w-full">
          <thead className="bg-slate-800/50 border-b border-slate-700">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Employee</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Designation</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Department</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Join Date</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Status</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Performance</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {employees.map((employee) => (
              <tr key={employee.id} className="hover:bg-slate-800/30">
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-slate-200">{employee.name}</p>
                    <p className="text-xs text-slate-500">{employee.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-300">{employee.designation}</td>
                <td className="px-6 py-4 text-sm text-slate-300">{employee.department}</td>
                <td className="px-6 py-4 text-sm text-slate-300">{new Date(employee.joinDate).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs ${getStatusColor(employee.status)}`}>
                    {employee.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <Award className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm font-medium text-white">{employee.performance}/5</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
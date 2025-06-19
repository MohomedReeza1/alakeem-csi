import React, { useEffect, useState } from 'react'
import api from '../api/axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Header from '../components/Header'
import { Link } from 'react-router-dom'

import Pagination from '@mui/material/Pagination';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

export default function Dashboard() {
  const [candidates, setCandidates] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(true)

  // Pagination state
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [total, setTotal] = useState(0)

  const navigate = useNavigate()
  const { role } = useAuth()

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true)
        const res = await api.get(`/candidates/paginated`, {
          params: {
            page,
            limit,
            search: searchQuery,
            stage: statusFilter
          }
        })
        setCandidates(res.data.data)
        setTotal(res.data.total)
      } catch (error) {
        console.error('Failed to fetch candidates:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCandidates()
  }, [page, limit, searchQuery, statusFilter])

  const totalPages = Math.ceil(total / limit)

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Candidate Dashboard</h1>

          {/* Filters */}
          <div className="bg-white p-4 rounded shadow mb-6 flex flex-wrap md:flex-nowrap gap-4 items-center justify-between">
            <div className="flex flex-wrap md:flex-nowrap gap-4 w-full md:w-auto flex-1">
              <input
                type="text"
                placeholder="Search by Name or Passport No"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setPage(1)
                }}
                className="border border-gray-300 px-4 py-2 rounded w-full md:w-1/3"
              />

              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value)
                  setPage(1)
                }}
                className="border border-gray-300 px-4 py-2 rounded w-full md:w-1/4"
              >
                <option value="">Filter by Latest Stage</option>
                <option value="Not Started">Not Started</option>
                <option value="Passport Registered">Passport Registered</option>
                <option value="Application Sent">Application Sent</option>
                <option value="Job Applied">Job Applied</option>
                <option value="Office Selected">Office Selected</option>
                <option value="Visa Status">Visa Status</option>
                <option value="Medical Status">Medical Status</option>
                <option value="Agreement Status">Agreement Status</option>
                <option value="Embassy Status">Embassy Status</option>
                <option value="SLBFE Status">SLBFE Status</option>
                <option value="Departed">Departed</option>
              </select>
            </div>

            {role === 'processor' && (
              <button
                onClick={() => navigate('/add')}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                Add New Candidate
              </button>
            )}
          </div>

          {/* Table */}
          <div className="overflow-x-auto bg-white rounded shadow">
            <table className="min-w-full text-left table-auto">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-6 py-3 font-medium text-sm">Created Date</th>
                  <th className="px-6 py-3 font-medium text-sm">Ref No</th>
                  <th className="px-6 py-3 font-medium text-sm">Full Name</th>
                  <th className="px-6 py-3 font-medium text-sm">Passport No</th>
                  <th className="px-6 py-3 font-medium text-sm">Latest Stage</th>
                  <th className="px-6 py-3 font-medium text-sm">Status</th>
                  <th className="px-6 py-3 font-medium text-sm">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-gray-500">Loading...</td>
                  </tr>
                ) : candidates.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-gray-500">No candidates found.</td>
                  </tr>
                ) : (
                  candidates.map((c, index) => (
                    <tr key={index} className="border-b">
                      <td className="px-6 py-4 text-gray-700">{formatDate(c.created_at)}</td>
                      <td className="px-6 py-4">{c.reference_number}</td>
                      <td className="px-6 py-4">{c.full_name}</td>
                      <td className="px-6 py-4">{c.passport_number}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-sm rounded-full font-medium
                          ${
                            c.latest_stage === 'Passport Registered' ? 'bg-blue-200 text-blue-800' :
                            c.latest_stage === 'Application Sent' ? 'bg-indigo-200 text-indigo-800' :
                            c.latest_stage === 'Job Applied' ? 'bg-lime-100 text-lime-800' :
                            c.latest_stage === 'Office Selected' ? 'bg-purple-200 text-purple-800' :
                            c.latest_stage === 'Visa Status' ? 'bg-yellow-200 text-yellow-800' : 
                            c.latest_stage === 'Medical Status' ? 'bg-teal-50 text-emerald-800' : 
                            c.latest_stage === 'Agreement Status' ? 'bg-cyan-200 text-cyan-800' : 
                            c.latest_stage === 'Embassy Status' ? 'bg-fuchsia-200 text-fuchsia-800' : 
                            c.latest_stage === 'SLBFE Status' ? 'bg-orange-200 text-orange-800' :
                            c.latest_stage === 'Departed' ? 'bg-green-200 text-green-800' :
                            c.latest_stage === 'Not Started' ? 'bg-red-200 text-red-700' :
                            'bg-gray-200 text-gray-700'
                          }
                        `}>
                          {c.latest_stage || 'Not Started'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-red-600">{c.status || '—'}</td>
                      <td className="px-6 py-4">
                        <Link to={`/candidate/${c.id}/process-tracker`} className="text-indigo-600 hover:text-indigo-800">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Material Pagination Controls */}
          <div className="flex flex-col md:flex-row items-center justify-between mt-6 gap-4">
            <FormControl variant="outlined" size="small" className="min-w-[120px]">
              <InputLabel>Rows per page</InputLabel>
              <Select
                value={limit}
                onChange={(e) => {
                  setPage(1)
                  setLimit(Number(e.target.value))
                }}
                label="Rows per page"
              >
                {[5, 10, 25].map((val) => (
                  <MenuItem key={val} value={val}>{val}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, newPage) => setPage(newPage)}
              color="primary"
              shape="rounded"
            />
          </div>
        </div>
      </div>
    </>
  )
}

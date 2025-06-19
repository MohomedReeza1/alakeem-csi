import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import Header from '../components/Header'

export default function CandidateTracker() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { role } = useAuth()
  const [candidate, setCandidate] = useState(null)
  const [processes, setProcesses] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
    const [newStage, setNewStage] = useState({
    stage: '',
    status: 'Pending',
  })

  useEffect(() => {
    const fetchTrackerData = async () => {
      try {
        // ✅ Fetch candidate basic info
        const candidateRes = await api.get(`/candidates/${id}`)
        setCandidate(candidateRes.data)

        // ✅ Fetch candidate process stages
        const processRes = await api.get(`/candidate-process/${id}`)
        setProcesses(processRes.data)
      } catch (err) {
        console.error('Failed to load tracker:', err)
      }
    }

    fetchTrackerData()
  }, [id])

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setShowForm(false)
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  const handleAddStage = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/candidate-process', {
        candidate_id: id,
        stage: newStage.stage,
        status: newStage.status,
        updated_at: new Date().toISOString().split('T')[0],
      })
      setProcesses([...processes, res.data])
      setShowForm(false) // close modal immediately ✅
      setMessage({ type: 'success', text: 'New process stage added successfully!' })
      setNewStage({ stage: '', status: 'Pending' }) // reset
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    } catch (err) {
      console.error('Failed to add process stage:', err)
      setMessage({ type: 'error', text: 'Error adding new process stage.' })
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    }
  }

  return (
    <>
    <Header />
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="text-blue-600 hover:text-blue-800"
            >
              ← Back to Dashboard
            </button>
          </div>
          <h2 className="text-3xl font-bold mb-4">Candidate Tracker</h2>

          

          {message.text && (
            <div className={`mb-4 p-3 rounded text-white ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
              {message.text}
            </div>
          )}

          {candidate && (
            <div className="bg-white p-4 rounded shadow mb-6 flex justify-between items-center">
              <div>
                <p><strong>Full Name:</strong> {candidate.full_name}</p>
                <p><strong>Passport No:</strong> {candidate.passport_number}</p>
                <p><strong>NIC:</strong> {candidate.nic}</p>
                <p><strong>Reference No:</strong> {candidate.reference_number}</p>
              </div>

              {role === 'processor' && ( // only processors see this
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Add New Process
                </button>
              )}

            </div>
          )}

          <div className="bg-white rounded shadow overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-200 text-sm">
                <tr>
                  <th className="px-6 py-3 text-left">Stage</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Updated Date</th>
                </tr>
              </thead>
              
              <tbody>
                  {processes.map((p, index) => (
                      <tr key={p.id} className="border-b">
                      <td className="px-6 py-4">{p.stage}</td>

                      <td className="px-6 py-4">
                          <select
                          value={p.status}
                          onChange={async (e) => {
                              const newStatus = e.target.value
                              try {
                              const res = await api.put(`/candidate-process/${p.id}`, {
                                  status: newStatus,
                                  updated_at: new Date().toISOString().split('T')[0], // YYYY-MM-DD
                              })
                              // Update local state
                              const updated = [...processes]
                              updated[index] = res.data
                              setProcesses(updated)
                              } catch (err) {
                              console.error('Failed to update status', err)
                              alert('Error updating process status.')
                              }
                          }}
                          className="border border-gray-300 p-1 rounded"
                          >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                          </select>
                      </td>

                      <td className="px-6 py-4">
                          {new Date(p.updated_at).toLocaleDateString()}
                      </td>
                      </tr>
                  ))}
                  </tbody>
            </table>
          </div>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg relative">
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold"
              >
                &times;
              </button>

              <h3 className="text-lg font-semibold mb-4">Add New Process Stage</h3>

              <form onSubmit={handleAddStage} className="space-y-4">
                <input
                  type="text"
                  placeholder="Stage Name (e.g., Embassy)"
                  value={newStage.stage}
                  onChange={(e) => setNewStage({ ...newStage, stage: e.target.value })}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />

                <select
                  value={newStage.status}
                  onChange={(e) => setNewStage({ ...newStage, status: e.target.value })}
                  className="w-full border border-gray-300 p-2 rounded"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>

                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
                >
                  Add Stage
                </button>
              </form>
            </div>
          </div>
        )}

    </div>
    </>
  )
}

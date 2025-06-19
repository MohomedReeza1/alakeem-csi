import React, { useState } from 'react'
import api from '../api/axios'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'

export default function CandidateForm() {
  const [passportExists, setPassportExists] = useState(false)
  const [referenceExists, setReferenceExists] = useState(false)
  const [form, setForm] = useState({
    full_name: '',
    passport_number: '',
    reference_number: '',
  })
  const navigate = useNavigate()

  const handleChange = (e) => {
    let { name, value } = e.target;

    // Disallow spaces in reference and passport number
    if (name === 'reference_number' || name === 'passport_number') {
      value = value.replace(/\s/g, '');
    }

    setForm({ ...form, [name]: value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/candidates', form)
      alert('Candidate added successfully!')
      navigate('/dashboard') // Redirect only on success
    } catch (error) {
      console.error('Error adding candidate:', error)
      alert('Failed to add candidate.')
    }
  }

  const checkExistingCandidate = async (type, value) => {
    if (!value) return
    try {
      const res = await api.get(`/candidates/search?${type}=${value}`)
      if (type === 'passport') setPassportExists(!!res.data)
      if (type === 'reference') setReferenceExists(!!res.data)
    } catch (err) {
      console.error('Search failed:', err)
      if (type === 'passport') setPassportExists(false)
      if (type === 'reference') setReferenceExists(false)
    }
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-bold mb-4">Add New Candidate</h2>

          <div className="flex justify-end mb-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="text-indigo-600 hover:text-indigo-800"
            >
              ← Back to Dashboard
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Reference Number First */}
            <div>
              <label className="block mb-1 font-medium">Reference Number</label>
              <input
                name="reference_number"
                value={form.reference_number}
                onChange={(e) => {
                  handleChange(e)
                  checkExistingCandidate('reference', e.target.value)
                }}
                className="w-full border border-gray-300 p-2 rounded font-normal"
                required
              />
              {referenceExists && (
                <p className="text-red-600 text-sm mt-1">
                  A candidate with this reference number already exists.
                </p>
              )}
            </div>

            {/* Passport Number Second */}
            <div>
              <label className="block mb-1 font-medium">Passport Number</label>
              <input
                name="passport_number"
                value={form.passport_number}
                onChange={(e) => {
                  handleChange(e)
                  checkExistingCandidate('passport', e.target.value)
                }}
                className="w-full border border-gray-300 p-2 rounded font-normal"
                required
              />
              {passportExists && (
                <p className="text-red-600 text-sm mt-1">
                  A candidate with this passport already exists.
                </p>
              )}
            </div>

            {/* Full Name Last */}
            <div>
              <label className="block mb-1 font-medium">Full Name</label>
              <input
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded font-normal"
                required
              />
            </div>

            <button
              type="submit"
              disabled={passportExists || referenceExists}
              className={`w-full py-2 rounded text-white ${passportExists || referenceExists ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

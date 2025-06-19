import React from 'react'
import { useParams } from 'react-router-dom'
import CandidateProcessTracker from './CandidateProcessTracker'

export default function CandidateProcessTrackerWrapper() {
  const { id } = useParams()
  return <CandidateProcessTracker candidateId={id} />
}
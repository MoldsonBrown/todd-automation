'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface AcceptanceCriteria {
  id: string
  title: string
  description: string
  given: string[]
  when: string[]
  then: string[]
  priority: 'high' | 'medium' | 'low'
  labels: string[]
  framework: 'maestro' | 'playwright' | 'selenium'
}

interface GeneratedTest {
  framework: string
  fileName: string
  content: string
  testPath: string
  branchName: string
}

export default function TestGenerator() {
  const [jiraConfig, setJiraConfig] = useState({
    issueKey: ''
  })
  
  const [acceptanceCriteria, setAcceptanceCriteria] = useState<AcceptanceCriteria | null>(null)
  const [generatedTest, setGeneratedTest] = useState<GeneratedTest | null>(null)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'jira' | 'criteria' | 'generate' | 'result'>('jira')

  const fetchJiraIssue = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/jira', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ issueKey: jiraConfig.issueKey })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setAcceptanceCriteria(data.acceptanceCriteria)
        setStep('criteria')
      } else {
        alert('Error: ' + data.error)
      }
    } catch (error) {
      alert('Error fetching Jira issue: ' + error)
    } finally {
      setLoading(false)
    }
  }

  const generateTest = async () => {
    if (!acceptanceCriteria) return
    
    setLoading(true)
    try {
      const response = await fetch('/api/generate-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          acceptanceCriteria,
          repository: 'Cook-Unity/maestro-test', // Por ahora hardcodeado
          framework: acceptanceCriteria.framework
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setGeneratedTest(data.generatedTest)
        setStep('result')
      } else {
        alert('Error: ' + data.error)
      }
    } catch (error) {
      alert('Error generating test: ' + error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          🤖 Generador Automático de Tests
        </h2>
        
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[
              { key: 'jira', label: 'Jira', icon: '🔗' },
              { key: 'criteria', label: 'Criteria', icon: '📋' },
              { key: 'generate', label: 'Generate', icon: '⚡' },
              { key: 'result', label: 'Result', icon: '✅' }
            ].map((stepItem, index) => (
              <div key={stepItem.key} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step === stepItem.key 
                    ? 'bg-blue-500 text-white' 
                    : index < ['jira', 'criteria', 'generate', 'result'].indexOf(step)
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {stepItem.icon}
                </div>
                <span className="ml-2 text-sm font-medium">{stepItem.label}</span>
                {index < 3 && <div className="w-8 h-0.5 bg-gray-300 mx-2" />}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Jira Configuration */}
        {step === 'jira' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Workflow-style Jira Configuration Card */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
              {/* Header similar to workflow cards */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Jira Integration</h3>
                      <p className="text-sm text-gray-600">Extract acceptance criteria from Jira issues</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-600 font-medium">Ready</span>
                  </div>
                </div>
              </div>
              
              {/* Content area */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left column - Configuration */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Configuration</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-600">Jira URL</span>
                          <span className="text-sm font-medium text-green-600">Configured</span>
                        </div>
                        <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-600">Authentication</span>
                          <span className="text-sm font-medium text-green-600">Ready</span>
                        </div>
                        <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-600">Environment</span>
                          <span className="text-sm font-medium text-blue-600">Production</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right column - Issue Input */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Issue Key</h4>
                      <input
                        type="text"
                        value={jiraConfig.issueKey}
                        onChange={(e) => setJiraConfig({...jiraConfig, issueKey: e.target.value})}
                        placeholder="QA-2301"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Format: PROJECT-NUMBER (e.g., QA-2301, PROJ-123)
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Action button */}
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={fetchJiraIssue}
                    disabled={loading || !jiraConfig.issueKey}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-sm hover:shadow-md flex items-center"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Fetching...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Fetch Issue
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Acceptance Criteria Review */}
        {step === 'criteria' && acceptanceCriteria && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              📋 Acceptance Criteria Extraídos
            </h3>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">{acceptanceCriteria.title}</h4>
              <p className="text-gray-600 mb-4">{acceptanceCriteria.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h5 className="font-medium text-green-700 mb-2">Given:</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {acceptanceCriteria.given.map((item, index) => (
                      <li key={index}>• {item}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-medium text-blue-700 mb-2">When:</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {acceptanceCriteria.when.map((item, index) => (
                      <li key={index}>• {item}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-medium text-purple-700 mb-2">Then:</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {acceptanceCriteria.then.map((item, index) => (
                      <li key={index}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    Framework: <span className="font-semibold">{acceptanceCriteria.framework}</span>
                  </span>
                  <span className="text-sm text-gray-600">
                    Priority: <span className="font-semibold">{acceptanceCriteria.priority}</span>
                  </span>
                </div>
                
                <button
                  onClick={generateTest}
                  disabled={loading}
                  className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 disabled:bg-gray-400"
                >
                  {loading ? 'Generating...' : 'Generate Test'}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Generated Test Result */}
        {step === 'result' && generatedTest && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              ✅ Test Generado Exitosamente
            </h3>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <div className="flex items-center">
                <div className="text-green-500 mr-2">✅</div>
                <div>
                  <h4 className="font-semibold text-green-800">Test generado y committeado</h4>
                  <p className="text-green-600 text-sm">
                    Branch: {generatedTest.branchName} | Framework: {generatedTest.framework}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Archivo generado:</h4>
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">{generatedTest.testPath}</code>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Código del test:</h4>
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                  {generatedTest.content}
                </pre>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={() => setStep('jira')}
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
              >
                Generar Otro Test
              </button>
              <button
                onClick={() => window.open(`https://github.com/Cook-Unity/maestro-test/tree/${generatedTest.branchName}`, '_blank')}
                className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
              >
                Ver en GitHub
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

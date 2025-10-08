'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  PlayIcon, 
  ChatBubbleLeftRightIcon, 
  Cog6ToothIcon,
  MagnifyingGlassIcon,
  MicrophoneIcon,
  PhotoIcon,
  PlusIcon
} from '@heroicons/react/24/outline'
import ChatInterface from './components/ChatInterface'
import WorkflowStatus from './components/WorkflowStatus'
import GitHubAuth from './components/GitHubAuth'
import { useWorkflowStore } from './store/workflowStore'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  workflowTriggered?: {
    name: string
    inputs: Record<string, any>
  }
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<'chat' | 'workflows'>('chat')
  const [githubToken, setGithubToken] = useState<string>('')
  const [messages, setMessages] = useState<Message[]>([]) // Move messages state here
  const [workflowExecuted, setWorkflowExecuted] = useState(false) // For glow effect
  const { workflows, isLoading } = useWorkflowStore()

  // Load messages from localStorage on component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('test-runner-messages')
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
        setMessages(parsedMessages)
      } catch (error) {
        console.error('Error loading saved messages:', error)
      }
    }
  }, [])

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('test-runner-messages', JSON.stringify(messages))
    }
  }, [messages])

  const handleAuthSuccess = (token: string) => {
    setGithubToken(token)
  }

  const clearMessages = () => {
    setMessages([])
    localStorage.removeItem('test-runner-messages')
  }

  const handleWorkflowExecuted = () => {
    setWorkflowExecuted(true)
    // Remove glow effect after 3 seconds
    setTimeout(() => {
      setWorkflowExecuted(false)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header - Estilo Google */}
      <header className="bg-gray-900 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              {/* Logo Google-style */}
              <div className="flex items-center space-x-2">
                <motion.div 
                  className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center shadow-sm border border-gray-600"
                >
                  <motion.div
                    className="w-6 h-6 text-yellow-400"
                    animate={{ 
                      rotate: 360
                    }}
                    transition={{ 
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                  </motion.div>
                </motion.div>
                <span className="text-white font-medium">Test Runner AI</span>
              </div>
            </div>
            
            <nav className="flex items-center space-x-4">
              {/* GitHub Authentication - Estilo botón */}
              <GitHubAuth onAuthSuccess={handleAuthSuccess} />
              
              <div className="flex space-x-1">
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'chat'
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <ChatBubbleLeftRightIcon className="w-4 h-4 inline mr-2" />
                  AI Mode
                </button>
                <button
                  onClick={() => setActiveTab('workflows')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    activeTab === 'workflows'
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  } ${
                    workflowExecuted && activeTab !== 'workflows'
                      ? 'animate-pulse shadow-lg shadow-blue-500/50 bg-blue-600/20 text-blue-300'
                      : ''
                  }`}
                >
                  <Cog6ToothIcon className="w-4 h-4 inline mr-2" />
                  Workflows
                </button>
              </div>
            </nav>
          </div>
        </div>
      </header>

        {/* Main Content - Estilo Google AI */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <AnimatePresence mode="wait">
          {activeTab === 'chat' ? (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
                <ChatInterface 
                  githubToken={githubToken} 
                  messages={messages}
                  setMessages={setMessages}
                  clearMessages={clearMessages}
                  onWorkflowExecuted={handleWorkflowExecuted}
                />
            </motion.div>
          ) : (
            <motion.div
              key="workflows"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <WorkflowStatus githubToken={githubToken} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

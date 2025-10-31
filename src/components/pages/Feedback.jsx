import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/layouts/Root"
import FeedbackList from "@/components/organisms/FeedbackList"
import FeedbackSubmissionModal from "@/components/organisms/FeedbackSubmissionModal"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
const Feedback = () => {
  const { user, isAuthenticated } = useSelector((state) => state.user)
  const { isInitialized } = useAuth()
  const navigate = useNavigate()
  const [isAddIdeaModalOpen, setIsAddIdeaModalOpen] = useState(false)
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false)

  useEffect(() => {
    if (isInitialized && isSignupModalOpen) {
      const { ApperUI } = window.ApperSDK
      ApperUI.showSignup("#signup-authentication")
    }
  }, [isInitialized, isSignupModalOpen])

  const handleAddIdeaClick = () => {
    if (isAuthenticated) {
      setIsAddIdeaModalOpen(true)
    } else {
      setIsSignupModalOpen(true)
    }
  }
  return (
    <div className="relative">
      <FeedbackList onFeedbackAdded={() => setIsAddIdeaModalOpen(false)} />
      
      {/* Fixed Add Idea Button - Top Right Corner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed top-24 right-6 z-40"
      >
        <Button
onClick={handleAddIdeaClick}
          icon="Plus"
          className="shadow-premium-hover bg-gradient-to-r from-primary to-accent text-white hover:shadow-xl transition-all duration-300"
        >
          Add Idea
        </Button>
      </motion.div>

      <FeedbackSubmissionModal
        isOpen={isAddIdeaModalOpen}
onClose={() => setIsAddIdeaModalOpen(false)}
        onSubmit={() => setIsAddIdeaModalOpen(false)}
      />

      {isSignupModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setIsSignupModalOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-2xl shadow-premium w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-gradient-to-r from-primary to-accent w-10 h-10 rounded-xl flex items-center justify-center mr-3">
                    <ApperIcon name="UserPlus" className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Sign up to submit feedback
                  </h2>
                </div>
                <button
                  onClick={() => setIsSignupModalOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <ApperIcon name="X" className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <p className="text-gray-600 mb-6 text-center">
                Create an account to share your ideas and help shape the future of our product.
              </p>
              <div id="signup-authentication" />
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <button
                    onClick={() => {
                      setIsSignupModalOpen(false)
                      navigate('/login?redirect=/feedback')
                    }}
                    className="font-medium text-primary hover:text-blue-700 transition-colors"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default Feedback
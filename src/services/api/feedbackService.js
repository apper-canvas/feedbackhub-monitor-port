import { getApperClient } from '@/services/apperClient'

export const feedbackService = {
  async getAll() {
    try {
      const apperClient = getApperClient()
      const response = await apperClient.fetchRecords('feedback_c', {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "upvotes_c" } },
          { field: { Name: "downvotes_c" } },
          { field: { Name: "upvoted_by_c" } },
          { field: { Name: "downvoted_by_c" } },
          { field: { Name: "CreatedOn" } }
        ],
        orderBy: [{ fieldName: "CreatedOn", sorttype: "DESC" }]
      })

      if (!response.success) {
        console.error(response.message)
        return []
      }

      return response.data.map(item => ({
        Id: item.Id,
        title: item.title_c || '',
        description: item.description_c || '',
        category: item.category_c || 'feature',
        status: item.status_c || 'new',
        upvotes: item.upvotes_c || 0,
        downvotes: item.downvotes_c || 0,
        upvotedBy: item.upvoted_by_c ? item.upvoted_by_c.split(',').filter(id => id.trim()) : [],
        downvotedBy: item.downvoted_by_c ? item.downvoted_by_c.split(',').filter(id => id.trim()) : [],
        createdAt: item.CreatedOn,
        comments: []
      }))
    } catch (error) {
      console.error('Error fetching feedback:', error?.response?.data?.message || error)
      return []
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient()
      const response = await apperClient.getRecordById('feedback_c', parseInt(id), {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "upvotes_c" } },
          { field: { Name: "downvotes_c" } },
          { field: { Name: "upvoted_by_c" } },
          { field: { Name: "downvoted_by_c" } },
          { field: { Name: "CreatedOn" } }
        ]
      })

      if (!response.success) {
        throw new Error(response.message || 'Feedback not found')
      }

      const item = response.data
      return {
        Id: item.Id,
        title: item.title_c || '',
        description: item.description_c || '',
        category: item.category_c || 'feature',
        status: item.status_c || 'new',
        upvotes: item.upvotes_c || 0,
        downvotes: item.downvotes_c || 0,
        upvotedBy: item.upvoted_by_c ? item.upvoted_by_c.split(',').filter(id => id.trim()) : [],
        downvotedBy: item.downvoted_by_c ? item.downvoted_by_c.split(',').filter(id => id.trim()) : [],
        createdAt: item.CreatedOn,
        comments: []
      }
    } catch (error) {
      console.error(`Error fetching feedback ${id}:`, error?.response?.data?.message || error)
      throw error
    }
  },

  async create(feedbackData) {
    try {
      const apperClient = getApperClient()
      const response = await apperClient.createRecord('feedback_c', {
        records: [{
          title_c: feedbackData.title || '',
          description_c: feedbackData.description || '',
          category_c: feedbackData.category || 'feature',
          status_c: 'new',
          upvotes_c: 0,
          downvotes_c: 0,
          upvoted_by_c: '',
          downvoted_by_c: ''
        }]
      })

      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success)
        if (failed.length > 0) {
          console.error(`Failed to create feedback: ${JSON.stringify(failed)}`)
          throw new Error(failed[0].message || 'Failed to create feedback')
        }
        
        const created = response.results[0].data
        return {
          Id: created.Id,
          title: created.title_c || '',
          description: created.description_c || '',
          category: created.category_c || 'feature',
          status: created.status_c || 'new',
          upvotes: created.upvotes_c || 0,
          downvotes: created.downvotes_c || 0,
          upvotedBy: [],
          downvotedBy: [],
          createdAt: created.CreatedOn
        }
      }
    } catch (error) {
      console.error('Error creating feedback:', error?.response?.data?.message || error)
      throw error
    }
  },

  async update(id, updateData) {
    try {
      const apperClient = getApperClient()
      const updatePayload = { Id: parseInt(id) }
      
      if (updateData.title) updatePayload.title_c = updateData.title
      if (updateData.description) updatePayload.description_c = updateData.description
      if (updateData.category) updatePayload.category_c = updateData.category
      if (updateData.status) updatePayload.status_c = updateData.status
      if (updateData.upvotes !== undefined) updatePayload.upvotes_c = updateData.upvotes
      if (updateData.downvotes !== undefined) updatePayload.downvotes_c = updateData.downvotes
      if (updateData.upvotedBy !== undefined) updatePayload.upvoted_by_c = Array.isArray(updateData.upvotedBy) ? updateData.upvotedBy.join(',') : updateData.upvotedBy
      if (updateData.downvotedBy !== undefined) updatePayload.downvoted_by_c = Array.isArray(updateData.downvotedBy) ? updateData.downvotedBy.join(',') : updateData.downvotedBy

      const response = await apperClient.updateRecord('feedback_c', {
        records: [updatePayload]
      })

      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success)
        if (failed.length > 0) {
          console.error(`Failed to update feedback: ${JSON.stringify(failed)}`)
          throw new Error(failed[0].message || 'Failed to update feedback')
        }

        return await this.getById(id)
      }
    } catch (error) {
      console.error('Error updating feedback:', error?.response?.data?.message || error)
      throw error
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient()
      const response = await apperClient.deleteRecord('feedback_c', {
        RecordIds: [parseInt(id)]
      })

      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success)
        if (failed.length > 0) {
          console.error(`Failed to delete feedback: ${JSON.stringify(failed)}`)
          throw new Error(failed[0].message || 'Failed to delete feedback')
        }
      }

      return true
    } catch (error) {
      console.error('Error deleting feedback:', error?.response?.data?.message || error)
      throw error
    }
  },

async upvote(id, userId) {
    try {
      const current = await this.getById(id)
      const hasUpvoted = current.upvotedBy.includes(String(userId))
      const hasDownvoted = current.downvotedBy.includes(userId)

      let newUpvotedBy = [...current.upvotedBy]
      let newDownvotedBy = [...current.downvotedBy]
      let newUpvotes = current.upvotes
      let newDownvotes = current.downvotes

      if (hasUpvoted) {
        newUpvotes -= 1
newUpvotedBy = newUpvotedBy.filter(uid => uid !== String(userId))
      } else {
        newUpvotes += 1
        newUpvotedBy.push(String(userId))
        
        if (hasDownvoted) {
          newDownvotes -= 1
          newDownvotedBy = newDownvotedBy.filter(uid => uid !== String(userId))
        }
      }

      return await this.update(id, {
        upvotes: newUpvotes,
        downvotes: newDownvotes,
        upvotedBy: newUpvotedBy,
        downvotedBy: newDownvotedBy
      })
    } catch (error) {
      console.error('Error upvoting feedback:', error?.response?.data?.message || error)
      throw error
    }
  },

async downvote(id, userId) {
    try {
      const current = await this.getById(id)
      const hasDownvoted = current.downvotedBy.includes(String(userId))
      const hasUpvoted = current.upvotedBy.includes(userId)

      let newUpvotedBy = [...current.upvotedBy]
      let newDownvotedBy = [...current.downvotedBy]
      let newUpvotes = current.upvotes
      let newDownvotes = current.downvotes

      if (hasDownvoted) {
        newDownvotes -= 1
newDownvotedBy = newDownvotedBy.filter(uid => uid !== String(userId))
      } else {
        newDownvotes += 1
        newDownvotedBy.push(String(userId))
        
        if (hasUpvoted) {
          newUpvotes -= 1
          newUpvotedBy = newUpvotedBy.filter(uid => uid !== String(userId))
        }
      }

      return await this.update(id, {
        upvotes: newUpvotes,
        downvotes: newDownvotes,
        upvotedBy: newUpvotedBy,
        downvotedBy: newDownvotedBy
      })
    } catch (error) {
      console.error('Error downvoting feedback:', error?.response?.data?.message || error)
      throw error
    }
  },

  async updateStatus(id, status) {
    return await this.update(id, { status })
  },

  async getComments(feedbackId) {
    return []
  },

async addComment(feedbackId, commentData) {
    return {
      Id: Date.now(),
      author: commentData.author,
      content: commentData.content,
      createdAt: new Date().toISOString()
    }
  }
}
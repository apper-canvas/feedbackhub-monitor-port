import { getApperClient } from '@/services/apperClient'

export const roadmapService = {
  async getAll() {
    try {
      const apperClient = getApperClient()
      const response = await apperClient.fetchRecords('roadmap_c', {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "timeline_c" } },
          { field: { Name: "estimated_date_c" } },
          { field: { Name: "votes_c" } }
        ]
      })

      if (!response.success) {
        console.error(response.message)
        return []
      }

      return response.data.map(item => ({
        Id: item.Id,
        title: item.title_c || '',
        description: item.description_c || '',
        status: item.status_c || 'Planned',
        timeline: item.timeline_c || 'later',
        estimatedDate: item.estimated_date_c || '',
        votes: item.votes_c || 0
      }))
    } catch (error) {
      console.error('Error fetching roadmap:', error?.response?.data?.message || error)
      return []
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient()
      const response = await apperClient.getRecordById('roadmap_c', parseInt(id), {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "timeline_c" } },
          { field: { Name: "estimated_date_c" } },
          { field: { Name: "votes_c" } }
        ]
      })

      if (!response.success) {
        throw new Error(response.message || 'Roadmap item not found')
      }

      const item = response.data
      return {
        Id: item.Id,
        title: item.title_c || '',
        description: item.description_c || '',
        status: item.status_c || 'Planned',
        timeline: item.timeline_c || 'later',
        estimatedDate: item.estimated_date_c || '',
        votes: item.votes_c || 0
      }
    } catch (error) {
      console.error(`Error fetching roadmap ${id}:`, error?.response?.data?.message || error)
      throw error
    }
  },

  async create(itemData) {
    try {
      const apperClient = getApperClient()
      const response = await apperClient.createRecord('roadmap_c', {
        records: [{
          title_c: itemData.title || '',
          description_c: itemData.description || '',
          status_c: itemData.status || 'Planned',
          timeline_c: itemData.timeline || 'later',
          estimated_date_c: itemData.estimatedDate || '',
          votes_c: parseInt(itemData.votes) || 0
        }]
      })

      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success)
        if (failed.length > 0) {
          console.error(`Failed to create roadmap: ${JSON.stringify(failed)}`)
          throw new Error(failed[0].message || 'Failed to create roadmap')
        }

        const created = response.results[0].data
        return {
          Id: created.Id,
          title: created.title_c || '',
          description: created.description_c || '',
          status: created.status_c || 'Planned',
          timeline: created.timeline_c || 'later',
          estimatedDate: created.estimated_date_c || '',
          votes: created.votes_c || 0
        }
      }
    } catch (error) {
      console.error('Error creating roadmap:', error?.response?.data?.message || error)
      throw error
    }
  },

  async update(id, updateData) {
    try {
      const apperClient = getApperClient()
      const updatePayload = { Id: parseInt(id) }
      
      if (updateData.title) updatePayload.title_c = updateData.title
      if (updateData.description) updatePayload.description_c = updateData.description
      if (updateData.status) updatePayload.status_c = updateData.status
      if (updateData.timeline) updatePayload.timeline_c = updateData.timeline
      if (updateData.estimatedDate) updatePayload.estimated_date_c = updateData.estimatedDate
      if (updateData.votes !== undefined) updatePayload.votes_c = parseInt(updateData.votes)

      const response = await apperClient.updateRecord('roadmap_c', {
        records: [updatePayload]
      })

      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success)
        if (failed.length > 0) {
          console.error(`Failed to update roadmap: ${JSON.stringify(failed)}`)
          throw new Error(failed[0].message || 'Failed to update roadmap')
        }

        return await this.getById(id)
      }
    } catch (error) {
      console.error('Error updating roadmap:', error?.response?.data?.message || error)
      throw error
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient()
      const response = await apperClient.deleteRecord('roadmap_c', {
        RecordIds: [parseInt(id)]
      })

      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success)
        if (failed.length > 0) {
          console.error(`Failed to delete roadmap: ${JSON.stringify(failed)}`)
          throw new Error(failed[0].message || 'Failed to delete roadmap')
        }
      }

      return true
    } catch (error) {
      console.error('Error deleting roadmap:', error?.response?.data?.message || error)
      throw error
    }
  }
}
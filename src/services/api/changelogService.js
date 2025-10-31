import { getApperClient } from '@/services/apperClient'

export const changelogService = {
  async getAll() {
    try {
      const apperClient = getApperClient()
      const response = await apperClient.fetchRecords('changelog_c', {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "version_c" } },
          { field: { Name: "release_date_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "CreatedOn" } }
        ],
        orderBy: [{ fieldName: "release_date_c", sorttype: "DESC" }]
      })

      if (!response.success) {
        console.error(response.message)
        return []
      }

      return response.data.map(item => ({
        Id: item.Id,
        title: item.title_c || '',
        description: item.description_c || '',
        version: item.version_c || '',
        releaseDate: item.release_date_c || item.CreatedOn,
        type: item.type_c || 'feature'
      }))
    } catch (error) {
      console.error('Error fetching changelog:', error?.response?.data?.message || error)
      return []
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient()
      const response = await apperClient.getRecordById('changelog_c', parseInt(id), {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "version_c" } },
          { field: { Name: "release_date_c" } },
          { field: { Name: "type_c" } }
        ]
      })

      if (!response.success) {
        throw new Error(response.message || 'Changelog entry not found')
      }

      const item = response.data
      return {
        Id: item.Id,
        title: item.title_c || '',
        description: item.description_c || '',
        version: item.version_c || '',
        releaseDate: item.release_date_c,
        type: item.type_c || 'feature'
      }
    } catch (error) {
      console.error(`Error fetching changelog ${id}:`, error?.response?.data?.message || error)
      throw error
    }
  },

  async create(entryData) {
    try {
      const apperClient = getApperClient()
      const response = await apperClient.createRecord('changelog_c', {
        records: [{
          title_c: entryData.title || '',
          description_c: entryData.description || '',
          version_c: entryData.version || '',
          release_date_c: entryData.releaseDate ? new Date(entryData.releaseDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          type_c: entryData.type || 'feature'
        }]
      })

      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success)
        if (failed.length > 0) {
          console.error(`Failed to create changelog: ${JSON.stringify(failed)}`)
          throw new Error(failed[0].message || 'Failed to create changelog')
        }

        const created = response.results[0].data
        return {
          Id: created.Id,
          title: created.title_c || '',
          description: created.description_c || '',
          version: created.version_c || '',
          releaseDate: created.release_date_c,
          type: created.type_c || 'feature'
        }
      }
    } catch (error) {
      console.error('Error creating changelog:', error?.response?.data?.message || error)
      throw error
    }
  },

  async update(id, updateData) {
    try {
      const apperClient = getApperClient()
      const updatePayload = { Id: parseInt(id) }
      
      if (updateData.title) updatePayload.title_c = updateData.title
      if (updateData.description) updatePayload.description_c = updateData.description
      if (updateData.version) updatePayload.version_c = updateData.version
      if (updateData.releaseDate) updatePayload.release_date_c = new Date(updateData.releaseDate).toISOString().split('T')[0]
      if (updateData.type) updatePayload.type_c = updateData.type

      const response = await apperClient.updateRecord('changelog_c', {
        records: [updatePayload]
      })

      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success)
        if (failed.length > 0) {
          console.error(`Failed to update changelog: ${JSON.stringify(failed)}`)
          throw new Error(failed[0].message || 'Failed to update changelog')
        }

        return await this.getById(id)
      }
    } catch (error) {
      console.error('Error updating changelog:', error?.response?.data?.message || error)
      throw error
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient()
      const response = await apperClient.deleteRecord('changelog_c', {
        RecordIds: [parseInt(id)]
      })

      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success)
        if (failed.length > 0) {
          console.error(`Failed to delete changelog: ${JSON.stringify(failed)}`)
          throw new Error(failed[0].message || 'Failed to delete changelog')
        }
      }

      return true
    } catch (error) {
      console.error('Error deleting changelog:', error?.response?.data?.message || error)
      throw error
    }
  }
}
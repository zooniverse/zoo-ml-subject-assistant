import { flow, getRoot, types } from 'mobx-state-tree'
import { ASYNC_STATES } from '@util'
import config from '@config'
import apiClient from 'panoptes-client'
import superagent from 'superagent'

const UserResourcesStore = types.model('UserResourcesStore', {

  operation: types.optional(types.enumeration('operation', ['', 'subjectSets', 'workflows']), ''),
  status: types.optional(types.string, ASYNC_STATES.IDLE),
  statusMessage: types.maybe(types.string),

  ownedProjects: types.array(types.frozen({})),
  ownedSubjectSets: types.array(types.frozen({})),
  ownedWorkflows: types.array(types.frozen({})),

}).actions(self => ({

  reset () {
    self.operation = ''
    self.status = ASYNC_STATES.IDLE
    self.statusMessage = undefined

    self.ownedProjects = []
    self.ownedSubjectSets = []
    self.ownedWorkflows = []

    const root = getRoot(self)
    root.workflowOutput.resetTargets()
  },

  fetch: flow(function * fetch (url) {
    const root = getRoot(self)

    try {
      let data = []
      let projects = []
      let workflows = []
      let subjectSets = []

      self.status = ASYNC_STATES.FETCHING

      // Fetch all projects this user is an owner of.
      data = yield apiClient.type('projects')
        .get({
          current_user_roles: 'owner',
        })
        .then(res => res)
        .catch(err => { throw err })
      projects.push(...data)

      // Fetch all projects this user is a collaborator of.
      data = yield apiClient.type('projects')
        .get({
          current_user_roles: 'collaborator',
        })
        .then(res => res)
        .catch(err => { throw err })
      projects.push(...data)

      for (let i = 0; i < projects.length; i++) {
        let project = projects[i];

        // Fetch all associated workflows.
        data = yield apiClient.type('workflows')
          .get({
            project_id: project.id,
          })
          .then(res => res)
          .catch(err => { throw err })
        workflows.push(...data)

        // Fetch all associated subject sets.
        data = yield apiClient.type('subject_sets')
          .get({
            project_id: project.id,
          })
          .then(res => res)
          .catch(err => { throw err })
        subjectSets.push(...data)
      }

      self.ownedProjects = projects
      self.ownedWorkflows = workflows
      self.ownedSubjectSets = subjectSets

      if (workflows.length > 0) root.workflowOutput.setRetireTarget(workflows[0].id)
      if (subjectSets.length > 0) root.workflowOutput.setMoveTarget(subjectSets[0].id)

      self.status = ASYNC_STATES.SUCCESS

    } catch (err) {
      const message = err && err.toString() || undefined
      self.status = ASYNC_STATES.ERROR
      self.statusMessage = message
      console.error('[UserResourcesStore] ', err)
    }

  }),
}))

export { UserResourcesStore }

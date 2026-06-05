import { createStore } from 'vuex'
import { Skill, Prompt } from '@/types'

interface State {
  skills: Skill[]
  prompts: Prompt[]
  currentSkill: Skill | null
  currentPrompt: Prompt | null
  loading: boolean
}

export default createStore<State>({
  state: {
    skills: [],
    prompts: [],
    currentSkill: null,
    currentPrompt: null,
    loading: false
  },

  mutations: {
    SET_SKILLS(state, skills: Skill[]) {
      state.skills = skills
    },
    ADD_SKILL(state, skill: Skill) {
      state.skills.push(skill)
    },
    UPDATE_SKILL(state, skill: Skill) {
      const index = state.skills.findIndex(s => s.id === skill.id)
      if (index !== -1) {
        state.skills[index] = skill
      }
    },
    DELETE_SKILL(state, id: number) {
      state.skills = state.skills.filter(s => s.id !== id)
    },
    SET_CURRENT_SKILL(state, skill: Skill | null) {
      state.currentSkill = skill
    },

    SET_PROMPTS(state, prompts: Prompt[]) {
      state.prompts = prompts
    },
    ADD_PROMPT(state, prompt: Prompt) {
      state.prompts.push(prompt)
    },
    UPDATE_PROMPT(state, prompt: Prompt) {
      const index = state.prompts.findIndex(p => p.id === prompt.id)
      if (index !== -1) {
        state.prompts[index] = prompt
      }
    },
    DELETE_PROMPT(state, id: number) {
      state.prompts = state.prompts.filter(p => p.id !== id)
    },
    SET_CURRENT_PROMPT(state, prompt: Prompt | null) {
      state.currentPrompt = prompt
    },

    SET_LOADING(state, loading: boolean) {
      state.loading = loading
    }
  },

  actions: {
    async fetchSkills({ commit }) {
      commit('SET_LOADING', true)
      try {
        const response = await fetch('/api/skills')
        const result = await response.json()
        if (result.success && result.data) {
          commit('SET_SKILLS', result.data)
        } else {
          console.error('Failed to fetch skills:', result.message)
        }
      } catch (error) {
        console.error('Failed to fetch skills:', error)
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async createSkill({ commit }, skill: Skill) {
      try {
        const response = await fetch('/api/skills', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(skill)
        })
        const result = await response.json()
        if (result.success && result.data) {
          commit('ADD_SKILL', result.data)
          return result.data
        } else {
          throw new Error(result.message || 'Failed to create skill')
        }
      } catch (error) {
        console.error('Failed to create skill:', error)
        throw error
      }
    },

    async updateSkill({ commit }, skill: Skill) {
      try {
        const response = await fetch(`/api/skills/${skill.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(skill)
        })
        const result = await response.json()
        if (result.success && result.data) {
          commit('UPDATE_SKILL', result.data)
        } else {
          throw new Error(result.message || 'Failed to update skill')
        }
      } catch (error) {
        console.error('Failed to update skill:', error)
        throw error
      }
    },

    async deleteSkill({ commit }, id: number) {
      try {
        const response = await fetch(`/api/skills/${id}`, { method: 'DELETE' })
        const result = await response.json()
        if (result.success) {
          commit('DELETE_SKILL', id)
        } else {
          throw new Error(result.message || 'Failed to delete skill')
        }
      } catch (error) {
        console.error('Failed to delete skill:', error)
        throw error
      }
    },

    async fetchPrompts({ commit }) {
      commit('SET_LOADING', true)
      try {
        const response = await fetch('/api/prompts')
        const result = await response.json()
        if (result.success && result.data) {
          commit('SET_PROMPTS', result.data)
        } else {
          console.error('Failed to fetch prompts:', result.message)
        }
      } catch (error) {
        console.error('Failed to fetch prompts:', error)
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async createPrompt({ commit }, prompt: Prompt) {
      try {
        const response = await fetch('/api/prompts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(prompt)
        })
        const result = await response.json()
        if (result.success && result.data) {
          commit('ADD_PROMPT', result.data)
          return result.data
        } else {
          throw new Error(result.message || 'Failed to create prompt')
        }
      } catch (error) {
        console.error('Failed to create prompt:', error)
        throw error
      }
    },

    async updatePrompt({ commit }, prompt: Prompt) {
      try {
        const response = await fetch(`/api/prompts/${prompt.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(prompt)
        })
        const result = await response.json()
        if (result.success && result.data) {
          commit('UPDATE_PROMPT', result.data)
        } else {
          throw new Error(result.message || 'Failed to update prompt')
        }
      } catch (error) {
        console.error('Failed to update prompt:', error)
        throw error
      }
    },

    async deletePrompt({ commit }, id: number) {
      try {
        const response = await fetch(`/api/prompts/${id}`, { method: 'DELETE' })
        const result = await response.json()
        if (result.success) {
          commit('DELETE_PROMPT', id)
        } else {
          throw new Error(result.message || 'Failed to delete prompt')
        }
      } catch (error) {
        console.error('Failed to delete prompt:', error)
        throw error
      }
    }
  },

  getters: {
    getSkillById: (state) => (id: number) => {
      return state.skills.find(skill => skill.id === id)
    },
    getPromptById: (state) => (id: number) => {
      return state.prompts.find(prompt => prompt.id === id)
    }
  }
})

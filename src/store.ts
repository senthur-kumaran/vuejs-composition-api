import { reactive, readonly } from 'vue'
import axios from 'axios'
import { today, thisWeek, thisMonth, Post } from './mocks'

interface State {
    posts: PostsState
}

interface PostsState {
    // o(n)
    ids: string[] // [1, 2, 3, 4]

    // o(1)
    all: Map<string, Post>

    loaded: boolean
}

class Strore {
    private state: State

    constructor(initial: State) {
        this.state = reactive(initial)
    }

    getState() {
        return readonly(this.state)
    }

    async fetchPosts() {
        const response = await axios.get<Post[]>('/posts')
        const postsState: PostsState = {
            ids: [],
            all: new Map(),
            loaded: true
        }
        for (const post of response.data) {
            postsState.ids.push(post.id)
            postsState.all.set(post.id, post)
        }
        this.state.posts = postsState
    }
}

const all = new Map<string, Post>()

const store = new Strore({
    posts: {
        all,
        ids: [],
        loaded: false
    }
})

export function useStore() {
    return store
}
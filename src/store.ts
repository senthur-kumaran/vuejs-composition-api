import { App, inject, reactive, readonly } from 'vue'
import axios from 'axios'
import { Post } from './mocks'

export interface User {
    id: string
    username: string
    password: string
}

export type Author = Omit<User, 'password'>

interface BaseState<T> {
    // o(n)
    ids: string[] // [1, 2, 3, 4]

    // o(1)
    all: Map<string, T>

    loaded: boolean
}

type PostsState = BaseState<Post>
interface AuthorsState extends BaseState<Author> {
    currentUserId: string | undefined
}

export interface State {
    posts: PostsState
    authors: AuthorsState
}

export const storeKey = Symbol('store');

export class Store {
    private state: State

    constructor(initial: State) {
        this.state = reactive(initial)
    }

    install(app: App) {
        app.provide(storeKey, this)
    }

    getState() {
        return readonly(this.state)
    }

    async createPost(post: Post) {
        const response = await axios.post<Post>('/posts', post);
        this.state.posts.all.set(response.data.id, response.data);
        this.state.posts.ids.push(response.data.id);
    }

    async updatePost(post: Post) {
        const response = await axios.put<Post>('/posts', post);
        this.state.posts.all.set(response.data.id, response.data);
    }

    async createUser(user: User) {
        const response = await axios.post<Author>('/users', user);
        this.state.authors.all.set(response.data.id, response.data);
        this.state.authors.ids.push(response.data.id);
        this.state.authors.currentUserId = response.data.id;
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

export const store = new Store({
    posts: {
        all: new Map<string, Post>(),
        ids: [],
        loaded: false
    },
    authors: {
        all: new Map<string, Author>(),
        ids: [],
        loaded: false,
        currentUserId: undefined
    }
})

export function useStore(): Store {
    const _store = inject<Store>(storeKey);
    if (!_store) {
        throw Error('Did you forgot to call provide?')
    }

    return _store;
}
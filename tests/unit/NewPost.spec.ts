import { mount } from '@vue/test-utils';
import NewPost from '../../src/components/NewPost.vue'
import { Store } from '../../src/store'

let routes: string[] = [];

jest.mock('vue-router', () => ({
  useRouter: () => {
    return {
      push: (route: string) => {
        routes.push(route);
      }
    }
  }
}))

jest.mock('axios', () => ({
  post: (url: string, payload: any) => {
    return {
      data: payload
    }
  }
}))

describe('NewPost', () => {
  const store = new Store({
    posts: {
      ids: [],
      all: new Map(),
      loaded: false
    },
    authors: {
      ids: ['1'],
      all: new Map([['1', {
        id: '1',
        username: 'username'
      }]]),
      loaded: true,
      currentUserId: '1'
    }
  });

  beforeEach(() => {
    routes = [];
  })

  it('creates a post and redirects to /',async () => {
    const wrapper = mount(NewPost, {
      global: {
        plugins: [store]
      }
    })

    expect(store.getState().posts.ids).toHaveLength(0);
    await wrapper.find('[data-test="submit"]').trigger('click');
    expect(store.getState().posts.ids).toHaveLength(1);
    expect(routes).toEqual(['/']);
  })
})
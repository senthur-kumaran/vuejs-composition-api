import moment from 'moment'

export interface Post {
    id: string
    title: string
    created: moment.Moment,
    html?: string
    markdown?: string
}

export const today: Post = {
    id: '1',
    title: 'Today',
    created: moment()
}

export const thisWeek: Post = {
    id: '2',
    title: 'This Week',
    created: moment().subtract(6, 'days')
}

export const thisMonth: Post = {
    id: '3',
    title: 'This Month',
    created: moment().subtract(10, 'days')
}
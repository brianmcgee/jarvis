import {MutationResolvers, QueryResolvers} from './schema/type-defs.graphqls'
import {ResolverContext} from './client/apollo'
import {PrismaClient} from ".prisma/client"
import {GraphQLScalarType, Kind} from 'graphql'
import dayjs from "dayjs";

const db = new PrismaClient()

const Query: Required<QueryResolvers<ResolverContext>> = {

    tasksForToday: async (_parent, _args, _context, _info) => {

        const endOfToday = dayjs()
            .endOf('day')
            .toDate()

        return await db.task.findMany({
            where: {
                completed: false,
                dueAt: {
                    lte: endOfToday
                }
            },
            include: {
                projects: true,
                followers: true,
                subtasks: true,
                parent: true,
                assignee: true
            }
        })
    },

    upcomingTasks: async (_parent, _args, _context, _info) => {

        const endOfNextWeek = dayjs()
            .add(7, 'days')
            .endOf('day')
            .toDate()

        return await db.task.findMany({
            where: {
                completed: false,
                dueAt: {
                    lte: endOfNextWeek
                }
            },
            include: {
                projects: true,
                followers: true,
                subtasks: true,
                parent: true,
                assignee: true
            }
        })
    },

    tasksForLater: async (_parent, _args, _context, _info) => {

        const endOfNextWeek = dayjs()
            .add(7, 'days')
            .endOf('day')
            .toDate()

        return await db.task.findMany({
            where: {
                completed: false,
                dueAt: {
                    gt: endOfNextWeek
                }
            },
            include: {
                projects: true,
                followers: true,
                subtasks: true,
                parent: true,
                assignee: true
            }
        })
    }
}

const Mutation: Required<MutationResolvers<ResolverContext>> = {
    updateName(_parent, _args, _context, _info) {
        return undefined
    },
}

const DateScalar = new GraphQLScalarType({
    name: 'Date',
    description: 'Custom date scalar',
    parseValue(value: string): Date {
        return new Date(value)
    },
    serialize(value: Date) {
        return value.toISOString()
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.STRING) {
            return new Date(ast.value)
        }
        return null;
    }
})

export default {Query, Mutation, Date: DateScalar}
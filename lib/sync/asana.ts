import { PrismaClient } from '@prisma/client'
import { Client, resources } from 'asana'

import log from '../logger'

const client = Client.create({
    defaultHeaders: {
        'asana-enable': 'new_user_task_lists',
    },
}).useAccessToken(process.env.ASANA_TOKEN)

/**
 * `@types/Asana` is a bit out of date so we add in extra fields here and do a cast
 */
type Task = resources.Tasks.Type & {
    liked?: boolean
    num_likes?: number
    num_subtasks?: number
    html_notes?: string
    start_on?: string
    permalink_url?: string
}

async function upsertTask(db: PrismaClient, task: Task) {
    const {
        gid,
        name,
        notes,
        html_notes: notesHtml,
        liked,
        num_likes: numLikes,
        num_subtasks: numSubtasks,
        followers,
        parent,
        permalink_url: permalinkUrl,
        projects,
        created_at: createdAt,
        modified_at: modifiedAt,
        completed_at: completedAt,
        due_on,
        completed,
        workspace,
        assignee,
    } = task as Task

    // TODO due_at is being returned null so for now we use due_on which is the localized date and hack it into an
    // ISO string.

    const dueAt = due_on ? new Date(due_on).toISOString() : undefined

    const connectWorkspace = { gid: workspace.gid }

    const connectOrCreateAssignee = assignee
        ? {
              connectOrCreate: {
                  where: { gid: assignee.gid },
                  create: { gid: assignee.gid, name: assignee.name },
              },
          }
        : undefined

    const connectOrCreateFollowers = {
        connectOrCreate: followers
            .map((f) => f as resources.Users.Type)
            .map(({ gid, name, email, photo }) => ({
                where: { gid },
                create: { gid, name, email, photo: JSON.stringify(photo) },
            })),
    }

    const connectOrCreateProjects = {
        connectOrCreate: projects.map(({ gid, name }) => ({
            where: { gid },
            create: { gid, name, workspaceId: workspace.gid },
        })),
    }

    const connectParent = parent
        ? {
              connect: { gid: parent.gid },
          }
        : undefined

    await db.task.upsert({
        where: { gid: task.gid },
        create: {
            gid,
            name,
            notes,
            notesHtml,
            liked,
            numLikes,
            numSubtasks,
            permalinkUrl,
            followers: connectOrCreateFollowers,
            projects: connectOrCreateProjects,
            parent: connectParent,
            workspace: { connect: connectWorkspace },
            assignee: connectOrCreateAssignee,
            createdAt,
            modifiedAt,
            dueAt,
            completedAt,
            completed,
        },
        update: {
            name,
            notes,
            notesHtml,
            liked,
            numLikes,
            numSubtasks,
            permalinkUrl,
            followers: connectOrCreateFollowers,
            projects: connectOrCreateProjects,
            parent: connectParent,
            workspace: { connect: connectWorkspace },
            assignee: connectOrCreateAssignee,
            createdAt,
            modifiedAt,
            dueAt,
            completedAt,
            completed,
        },
    })
}

async function fullSync(db: PrismaClient = new PrismaClient()): Promise<void> {
    log.info('Full syncing tasks from asana')

    const profile = await client.users.me()
    const { gid: userId, workspaces } = profile

    log.info({ profile }, '%d workspaces detected', workspaces.length)

    const opt_fields = [
        'id',
        'name',
        'notes',
        'html_notes',
        'liked',
        'num_likes',
        'num_subtasks',
        'permalink_url',
        'assignee_status',
        'created_at',
        'modified_at',
        'start_on',
        'due_at',
        'due_on',
        'completed',
        'completed_at',
        'parent',
        'assignee',
        'assignee.name',
        'followers.name',
        'projects.name',
        'projects.team.name',
        'workspace.name',
        'workspace.is_organization',
    ].join(',')

    const userIds = new Set<string>()
    const projectIds = new Set<string>()

    for (const workspace of workspaces) {
        const { gid: workspaceId } = workspace

        // upsert workspace info
        const fullWorkspace = await client.workspaces.findById(workspaceId)

        await db.workspace.upsert({
            where: { gid: workspaceId },
            create: {
                gid: workspaceId,
                name: fullWorkspace.name,
                isOrganization: fullWorkspace.is_organization,
            },
            update: {
                name: fullWorkspace.name,
                isOrganization: fullWorkspace.is_organization,
            },
        })

        const params = {
            workspace: workspaceId,
            assignee: +userId,
            completed_since: 'now',
            opt_fields,
        }

        /**
         * There are supposed to be fetch() and stream() methods on the ResourceList according to the official
         * docs but the typescript types does not seem to include them. For now just using the simple fetchNext()
         * paging approach.
         */

        let fetchNext = client.tasks.findAll(params)
        let page: resources.ResourceList<resources.Tasks.Type> | null = null

        do {
            page = await fetchNext

            if (!page) {
                // we have reached the last page
                break
            }

            const {
                data,
                nextPage,
                _response: { next_page },
            } = page

            for (const task of data) {
                const { parent } = task as Task

                // capture all userIds
                if (task.assignee) userIds.add(task.assignee.gid)
                task.followers.forEach(({ gid }) => userIds.add(gid))

                // capture all projectIds
                task.projects.forEach(({ gid }) => projectIds.add(gid))

                // check if the parent is in the db already
                const parentInDb = parent ? (await db.task.count({ where: { gid: parent.gid } })) === 1 : false

                if (parent && !parentInDb) {
                    // recursively fetch and insert the task ancestry before continuing
                    const parentTask = await client.tasks.findById(parent.gid, {
                        opt_fields,
                    })
                    await upsertTask(db, parentTask as Task)
                }

                // upsert this task
                await upsertTask(db, task)
            }

            // reset the page for next fetch
            page = null

            // trigger next fetch request if there is one
            if (next_page) {
                fetchNext = nextPage()
            }
        } while (page)
    }

    // Fetch latest full data for relations such as Users, Projects etc

    for (const userId of userIds) {
        const { email, photo } = await client.users.findById(userId)
        await db.user.update({
            where: { gid: userId },
            data: { email, photo: JSON.stringify(photo) },
        })
    }

    for (const projectId of projectIds) {
        const { color, created_at } = await client.projects.findById(projectId)
        await db.project.update({
            where: { gid: projectId },
            data: { color, createdAt: created_at },
        })
    }

    log.info('Finished syncing tasks from Asana')
}

export default {
    fullSync,
}

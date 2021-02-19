import Head from 'next/head'
import {GetServerSideProps, GetStaticProps} from 'next';
import {initializeApollo} from "../lib/graphql/client/apollo";
import {DashboardDocument, TaskSummaryFragment, useDashboardQuery} from "../lib/graphql/client/tasks.graphql";
import dayjs from "dayjs";


export default function Home() {

    const {
        tasksForToday,
        upcomingTasks,
        tasksForLater
    } = useDashboardQuery({
        // update every 10 seconds
        pollInterval: 10_000,
    }).data

    const renderTask = (task: TaskSummaryFragment) => {

        const {projects, dueAt} = task

        return (
            <li key={task.gid.toString()}>
                <a href="#" className="block hover:bg-gray-50">
                    <div className="px-4 py-4 flex items-center sm:px-6">
                        <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <div className="flex text-sm font-medium text-indigo-600 truncate">
                                    <p>{task.name}</p>
                                </div>
                                <div className="mt-2 flex">
                                    <div className="flex items-center text-sm text-gray-500">
                                        <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                             xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                                             aria-hidden="true">
                                            <path fillRule="evenodd"
                                                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                                  clipRule="evenodd"/>
                                        </svg>
                                        <p>
                                            {
                                                dueAt &&
                                                <span>
                                                    Due <time
                                                    dateTime={dueAt}> {dayjs(dueAt).format('DD-MM-YYYY')}</time>
                                                </span>
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 flex-shrink-0 sm:mt-0">
                                <div className="flex overflow-hidden">
                                </div>
                            </div>
                        </div>
                        <div className="ml-5 flex-shrink-0">
                            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg"
                                 viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd"
                                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                      clipRule="evenodd"/>
                            </svg>
                        </div>
                    </div>
                </a>
            </li>
        )

    }

    return (
        <div>
            <Head>
                <title>Dashboard</title>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main className="flex flex-col items-center bg-gray-50 w-full h-screen py-16">
                <div className="container mx-auto bg-gray">

                    <div className="pb-5 border-b border-gray-200">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Today
                        </h3>
                    </div>

                    <div className="bg-white shadow overflow-hidden sm:rounded-md">

                        <ul className="divide-y divide-gray-200">
                            {(tasksForToday).map(t => renderTask(t))}
                        </ul>

                    </div>

                    <div className="pb-5 border-b border-gray-200 mt-8">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Upcoming
                        </h3>
                    </div>

                    <div className="bg-white shadow overflow-hidden sm:rounded-md">

                        <ul className="divide-y divide-gray-200">
                            {(upcomingTasks).map(t => renderTask(t))}
                        </ul>

                    </div>

                    <div className="pb-5 border-b border-gray-200 mt-8">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Later
                        </h3>
                    </div>

                    <div className="bg-white shadow overflow-hidden sm:rounded-md">

                        <ul className="divide-y divide-gray-200">
                            {(tasksForLater).map(t => renderTask(t))}
                        </ul>

                    </div>
                </div>
            </main>
        </div>
    )
}


export const getServerSideProps: GetServerSideProps = async (context) => {

    const apolloClient = initializeApollo()

    await apolloClient.query({
        query: DashboardDocument,
    })

    return {
        props: {
            initialApolloState: apolloClient.cache.extract(),
        }
    }
}
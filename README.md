# Jarvis

A NextJS based personal assistant. Intended to provide useful dashboards and other functionality across a wide variety
of data sources such as Asana, Clubhouse, Github and more. 

Contents:

- [Requirements](#requirements)
- [Configuration](#configuration)
- [Installation](#installation)
- [Usage](#usage)

## Requirements

You should ensure you have the following installed:

* [direnv](https://direnv.net)
* [Node 14.x](https://nodejs.org)
* [Yarn](https://yarnpkg.com) 

## Configuration

Create a file called `.env.local` in the root directory and set your Asana access token:

```terminal
ASANA_TOKEN=xxxxxxxxx
```

## Installation

```terminal
$ yarn install              # install dependencies
$ yarn prisma:migrate       # create Sqlite db and apply migrations
```

## Usage

To run the dev server:

```terminal
$ yarn dev
```

To perform a manual sync of data sources:

```terminal
$ yarn sync
```

To start background periodic syncing of data sources:

```terminal
$ yarn sync:cron
```

To view the contents of the db directly:

```terminal
$ yarn prisma:studio
```
# Re:OS

View GitHub activity on Slack.

## About

A simple slack bot that will give you recent activity data on a user's GitHub. If they are in the Hackclub slack and have it linked on their profile, it will read from that too!

## Features

`/git-summaries-repo [Repo Name]`
Get recent activity from a repo
`/git-summaries-repo [GitHub User] | [Slack User]`
`/git-summaries-ping`

| Command               | Arguments         | Description                                | Example                                   |
| :-------------------- | :---------------- | :----------------------------------------- | :---------------------------------------- |
| `/git-summaries-repo` | `Repo Name`       | Display recent activity from a repo        | `/git-summaries-repo thatcorley/Re-OS`    |
| `/git-summaries-user` | `Slack User Ping` | Display recent activity from a GitHub User | `/git-summaries-repo @Corley`             |
| `/git-summaries-ping` | None              | Returns ping                               | `/git-summaries-repo @Corley`             |

## Tech stack

- JavaScript (Node.js)
- Hosted on Vercel

## Running locally

Clone the repo and save it locally and open `index.html` with Node.js.
Add .env and save keys `SLACK_BOT_TOKEN` and `SLACK_APP_TOKEN` to it.

## Deployment

The site auto-deploys with Vercel.

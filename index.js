require("dotenv").config();

const { App, ExpressReceiver } = require("@slack/bolt");

const receiver = new ExpressReceiver({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
});

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    receiver,
});

async function getRecentRepos(user) {
    const gitData = await fetch(`https://api.github.com/users/${user}/events/public`, {
        headers: {
            'Accept': 'application/vnd.github+json',
            'User-Agent': 'git-summaries'
        }
    });

    const events = await gitData.json();
    const cut = Date.now() - (30 * 24 * 60 * 60 * 1000);

    const repos = new Set();
    for (const event of events) {
        if (new Date(event.created_at).getTime() < cut) continue;

        if (['PushEvent', 'PullRequestEvent', 'IssuesEvent', 'CreateEvent'].includes(event.type)) {
            repos.add(event.repo.name);
        }
    }

    return [...repos];
}

app.command("/git-summaries-ping", async ({ command, ack, respond }) => {
    const start = Date.now();
    await ack();
    const latency = Date.now() - start;
    await respond({ text: `Pong!\nLatency: ${latency}ms` });
});

app.command("/git-summaries-activity", async ({ command, client, ack, respond }) => {
    await ack();
    const userParam = command.text.trim();
    const match = userParam.match(/<@([A-Z0-9]+)(?:\|[^>]+)?>/);

    if (!match) {
        return respond({ text: "Please mention a user, e.g. `/git-summaries-activity @someone`" });
    }

    const userID = match[1];

    const user = await client.users.profile.get({
        user: userID,
        include_labels: true
    });

    const fields = user.profile.fields || {};
    const github = Object.values(fields).find(f => f.label?.toLowerCase() === 'github');

    if (github) {
        const data = await getRecentRepos(github.value.replace("https://github.com/", ""));
        const repoStr = data.length
            ? data.map(r => `• <https://github.com/${r}|${r}>`).join('\n')
            : '_No activity found in the last 30 days_';

        await respond({ text: `GitHub Account: ${github.value}\n\nRecent Activity (30 Days):\n${repoStr}` });
    } else {
        await respond({ text: "No GitHub Account Connected!" });
    }
});

module.exports = receiver.app;
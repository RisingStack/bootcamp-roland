const Router = require('koa-router');
const router = new Router();

const userSchema = require('./db/models/user');
const repositorySchema = require('./db/models/repository');
const contributionSchema = require('./db/models/contribution');
const { use } = require('chai');

router.get('/hello', (ctx) => ctx.body = 'Hello World !');

// Repository
router.get('/readRepository', async (ctx) => ctx.body = await repositorySchema.read({id: 1}));

router.get('/insertRepository', (ctx) => ctx.body = `
<form method='POST' action='/insertRepository' >
    <input style='display:block' name='id' placeholder='id' type='number'>
    <input style='display:block' name='owner' placeholder='owner' type='text'>
    <input style='display:block' name='full_name' placeholder='full_name' type='text'>
    <input style='display:block' name='html_url' placeholder='html_url' type='text'>
    <input style='display:block' name='description' placeholder='description' type='text'>
    <input style='display:block' name='language' placeholder='language' type='text'>
    <input style='display:block' name='stargazers_count' placeholder='stargazers_count' type='text'>
    <button>Insert</button>
</form>
`);

router.post('/insertRepository', async (ctx) => {
    const {id, owner, full_name, html_url, description, language, stargazers_count} = ctx.request.body;
    ctx.body = await repositorySchema.insert({id, owner, full_name, html_url, description, language, stargazers_count});
});

// User
router.get('/readUser', async (ctx) => ctx.body = await userSchema.read({ id: 1}));

router.get('/insertUser', (ctx) => ctx.body = `
    <form method='POST' action='/insertUser' >
        <input style='display:block' name='id' placeholder='id' type='number'>
        <input style='display:block' name='login' placeholder='login' type='text'>
        <input style='display:block' name='avatar_url' placeholder='avatar_url' type='text'>
        <input style='display:block' name='html_url' placeholder='html_url' type='text'>
        <input style='display:block' name='type' placeholder='type' type='text'>
        <button>Insert</button>
    </form>
`);

router.post('/insertUser', async (ctx) => {
    const {id, login, avatar_url, html_url, type} = ctx.request.body;
    ctx.body = await userSchema.insert({ id, login, avatar_url, html_url, type });
});

// Contribution
router.get('/readContribution', async (ctx) => {
    const input = {repository: {id: 1, full_name: 'Belas todolist'}};
    ctx.body = await contributionSchema.read(input);
});

router.get('/insertContribution', (ctx) => ctx.body = `
    <form method='POST' action='/insertContribution' >
        <input style='display:block' name='repository' placeholder='repository' type='number'>
        <input style='display:block' name='user' placeholder='user' type='number'>
        <input style='display:block' name='line_count' placeholder='line_count' type='text'>
        <button>Insert</button>
    </form>
`);

router.post('/insertContribution', async (ctx) => {
    const {repository, user, line_count} = ctx.request.body;
    ctx.body = await contributionSchema.insertOrReplace({repository, user, line_count});
});

module.exports = router;
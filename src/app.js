import express from 'express';
import dotenv from "dotenv";
import { Octokit } from "octokit";

const app = express();

dotenv.config();
const port = process.env.PORT || 1234;


const octokit = new Octokit({ 
  auth: process.env.GITHUB_TOKEN, 
});

const requestResult = async () => {
    const data = await octokit.request('GET /search/repositories?q=user:{username}&sort=stars&order=desc&per_page=10', {
        username: 'google',
        headers: {
            'Accept': 'application/vnd.github+json',
        },
    });
    return data;
}

app.get('/topRepos', async (req, res) => {
    try{
        let data = await requestResult();
        data = data?.data?.items?.map((repo) => {
            return {
                name: repo.name,
            };
        });
        return res.status(200).json(data);
    }catch(error){
        return res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
  console.log(`La aplicación está escuchando en http://localhost:${port}`);
});

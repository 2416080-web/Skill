const axios = require('axios');

/**
 * Clean username from either pure handle or URL (e.g. https://github.com/torvalds)
 */
const extractGithubUsername = (input) => {
  if (!input) return null;
  const trimmed = input.trim();
  if (trimmed.includes('github.com/')) {
    const parts = trimmed.split('github.com/')[1].split('/')[0];
    return parts.replace(/[^a-zA-Z0-9_-]/g, '');
  }
  return trimmed.replace(/^@/, '').replace(/[^a-zA-Z0-9_-]/g, '');
};

/**
 * Fetch GitHub user details and recent top public repositories
 */
const fetchGithubData = async (userInput) => {
  const username = extractGithubUsername(userInput);
  if (!username) {
    return { success: false, message: 'Invalid GitHub username or URL' };
  }

  const headers = {
    'User-Agent': 'SkillProof-Platform/1.0',
    Accept: 'application/vnd.github.v3+json',
  };

  if (process.env.GITHUB_TOKEN && process.env.GITHUB_TOKEN.trim() !== '') {
    headers.Authorization = `token ${process.env.GITHUB_TOKEN.trim()}`;
  }

  try {
    // 1. Fetch user profile
    const userRes = await axios.get(`https://api.github.com/users/${username}`, {
      headers,
      timeout: 5000,
    });

    const userData = userRes.data;

    // 2. Fetch top public repos
    let repos = [];
    try {
      const reposRes = await axios.get(
        `https://api.github.com/users/${username}/repos?sort=updated&per_page=6`,
        { headers, timeout: 5000 }
      );
      repos = reposRes.data.map((repo) => ({
        id: repo.id,
        name: repo.name,
        description: repo.description,
        htmlUrl: repo.html_url,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language,
        updatedAt: repo.updated_at,
      }));
    } catch (repoErr) {
      console.warn(`Could not fetch repos for ${username}:`, repoErr.message);
    }

    return {
      success: true,
      data: {
        username: userData.login,
        name: userData.name || userData.login,
        avatarUrl: userData.avatar_url,
        htmlUrl: userData.html_url,
        bio: userData.bio,
        publicRepos: userData.public_repos,
        followers: userData.followers,
        following: userData.following,
        topRepos: repos,
      },
    };
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return { success: false, message: `GitHub user "${username}" was not found.` };
    }
    if (error.response && error.response.status === 403) {
      return {
        success: false,
        message: 'GitHub API rate limit exceeded. Please try again later or configure GITHUB_TOKEN.',
      };
    }
    return {
      success: false,
      message: error.message || 'Unable to fetch GitHub profile.',
    };
  }
};

module.exports = {
  extractGithubUsername,
  fetchGithubData,
};

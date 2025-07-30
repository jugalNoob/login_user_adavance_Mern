import React, { useEffect, useState } from 'react';

const DashboardG = () => {
  const [profile, setProfile] = useState(null);

  const fetchUser = async () => {
    try {
      const res = await fetch('http://localhost:9000/login/success', {
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        setProfile(data.user._json); // full GitHub profile data
      }
    } catch (error) {
      console.error('Not authenticated');
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (!profile) return <p style={{ padding: '2rem' }}>Loading GitHub profile...</p>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <img src={profile.avatar_url} alt="Avatar" style={styles.avatar} />
        <h2>{profile.name || profile.login}</h2>
        <p style={styles.username}>@{profile.login}</p>
        <p style={styles.location}>📍 {profile.location || 'N/A'}</p>

        <div style={styles.stats}>
          <div><strong>Repos:</strong> {profile.public_repos}</div>
          <div><strong>Followers:</strong> {profile.followers}</div>
          <div><strong>Following:</strong> {profile.following}</div>
        </div>

        <ul style={styles.list}>
          <li><strong>ID:</strong> {profile.id}</li>
          <li><strong>Node ID:</strong> {profile.node_id}</li>
          <li><strong>GitHub:</strong> <a href={profile.html_url} target="_blank" rel="noreferrer">{profile.html_url}</a></li>
          <li><strong>Email:</strong> {profile.email || 'Not public'}</li>
          <li><strong>Company:</strong> {profile.company || 'N/A'}</li>
          <li><strong>Blog:</strong> {profile.blog ? <a href={profile.blog}>{profile.blog}</a> : 'N/A'}</li>
          <li><strong>Twitter:</strong> {profile.twitter_username || 'N/A'}</li>
          <li><strong>Created:</strong> {new Date(profile.created_at).toLocaleDateString()}</li>
          <li><strong>Last Updated:</strong> {new Date(profile.updated_at).toLocaleDateString()}</li>
        </ul>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: '#f4f4f4',
    minHeight: '100vh',
  },
  card: {
    width: '100%',
    maxWidth: '500px',
    background: '#fff',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  avatar: {
    width: '120px',
    borderRadius: '50%',
    marginBottom: '1rem',
  },
  username: {
    fontSize: '1rem',
    color: '#555',
  },
  location: {
    fontSize: '0.95rem',
    color: '#777',
    marginBottom: '1rem',
  },
  stats: {
    display: 'flex',
    justifyContent: 'space-around',
    margin: '1rem 0',
    fontWeight: 'bold',
  },
  list: {
    textAlign: 'left',
    marginTop: '1rem',
    listStyle: 'none',
    padding: 0,
  },
};

export default DashboardG;
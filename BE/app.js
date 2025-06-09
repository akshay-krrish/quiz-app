require('dotenv').config();
const express = require('express');
const {
  OAuth2Client,
  UserRefreshClient,
} = require('google-auth-library');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const oAuth2Client = new OAuth2Client(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  'postmessage',
);

app.post('/auth/google', async (req, res) => {
  try {
    const { tokens } = await oAuth2Client.getToken(req.body.code); // exchange code for tokens
    const responseData = {
      data: {
        access_token: tokens.access_token,
        id_token: tokens.id_token,
        refresh_token: tokens.refresh_token,
        scope: tokens.scope,
        token_type: tokens.token_type,
        expiry_date: tokens.expiry_date
      }
    };
    res.json(responseData);
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ 
      error: {
        message: 'Authentication failed',
        details: error.message
      }
    });
  }
});

app.post('/auth/google/refresh-token', async (req, res) => {
  try {
    const user = new UserRefreshClient(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      req.body.refreshToken,
    );
    const { credentials } = await user.refreshAccessToken(); // obtain new tokens
    
    // Restructure the response to match frontend expectations
    const responseData = {
      data: {
        access_token: credentials.access_token,
        id_token: credentials.id_token,
        refresh_token: credentials.refresh_token,
        scope: credentials.scope,
        token_type: credentials.token_type,
        expiry_date: credentials.expiry_date
      }
    };
    
    res.json(responseData);
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({ 
      error: {
        message: 'Token refresh failed',
        details: error.message
      }
    });
  }
});

app.listen(3001, () => console.log(`Server is running on port 3001`));
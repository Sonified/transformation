// Cloudflare Worker — paste this into the Workers dashboard
// Route: your-domain.com/* 
const PASSWORD = 'dispenza2026';
const COOKIE_NAME = 'transformation_auth';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function hashPassword(pw) {
  const encoder = new TextEncoder();
  return crypto.subtle.digest('SHA-256', encoder.encode(pw + '_transformation_salt'))
    .then(buf => [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join(''));
}

function getCookie(request, name) {
  const cookie = request.headers.get('Cookie') || '';
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? match[1] : null;
}

function loginPage(error = '') {
  return new Response(`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Transformation — Login</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#0a0a0f;color:#e0e0e0;display:flex;align-items:center;justify-content:center;min-height:100vh}
.login{text-align:center;max-width:340px;width:100%;padding:2rem}
h1{font-size:1.5rem;font-weight:300;letter-spacing:.15em;text-transform:uppercase;color:#9b7dd4;margin-bottom:.5rem}
p{color:#888;font-size:.85rem;margin-bottom:2rem}
input{width:100%;padding:.8rem 1rem;background:#151520;border:1px solid #2a2a3a;border-radius:8px;color:#e0e0e0;font-size:1rem;text-align:center;outline:none}
input:focus{border-color:#7c5cbf}
button{width:100%;margin-top:1rem;padding:.8rem;background:#7c5cbf;color:#fff;border:none;border-radius:8px;font-size:.95rem;cursor:pointer}
button:hover{background:#9b7dd4}
.error{color:#e57373;font-size:.85rem;margin-top:1rem}
</style></head><body>
<div class="login">
<h1>Transformation</h1>
<p>Enter password to continue</p>
<form method="POST">
<input type="password" name="password" placeholder="Password" autofocus required>
<button type="submit">Enter</button>
${error ? `<div class="error">${error}</div>` : ''}
</form>
</div></body></html>`, {
    status: 401,
    headers: { 'Content-Type': 'text/html;charset=UTF-8' }
  });
}

export default {
  async fetch(request, env) {
    const validHash = await hashPassword(PASSWORD);
    
    // Check existing auth cookie
    const authCookie = getCookie(request, COOKIE_NAME);
    if (authCookie === validHash) {
      // Authenticated — pass through to origin
      return fetch(request);
    }

    // Handle login POST
    if (request.method === 'POST') {
      const formData = await request.formData();
      const pw = formData.get('password') || '';
      const pwHash = await hashPassword(pw);
      
      if (pwHash === validHash) {
        // Set cookie and redirect to origin
        const url = new URL(request.url);
        return new Response(null, {
          status: 302,
          headers: {
            'Location': url.pathname || '/',
            'Set-Cookie': `${COOKIE_NAME}=${validHash}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE}`
          }
        });
      }
      return loginPage('Incorrect password');
    }

    // Show login page
    return loginPage();
  }
};

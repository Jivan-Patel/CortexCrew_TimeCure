async function extractError() {
  const email = `test_9999@example.com`;
  
  // Register first to ensure account exists
  await fetch('http://localhost:3000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: "tester", email, password: "password123" })
  });

  // Login that crashes
  const res = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: "password123" })
  });
  
  const text = await res.text();
  const preStart = text.indexOf('<pre>');
  const preEnd = text.indexOf('</pre>');
  if (preStart !== -1) {
    console.log("TRACE START\n" + text.substring(preStart + 5, preEnd) + "\nTRACE END");
  } else {
    console.log("NO TRACE, Status: " + res.status + ", Body: " + text);
  }
}
extractError();

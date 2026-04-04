async function test() {
  const email = `test_${Date.now()}@example.com`;
  const password = "password123";
  
  console.log('--- Registering ---');
  try {
    const res = await fetch('https://cortexcrew-timecure-2.onrender.com/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: "tester", email, password })
    });
    console.log('Register Status:', res.status);
    const body = await res.text();
    console.log('Register Body:', body);
  } catch (err) {
    console.error('Register error:', err);
  }

  console.log('\n--- Logging In ---');
  try {
    const res = await fetch('https://cortexcrew-timecure-2.onrender.com/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    console.log('Login Status:', res.status);
    const body = await res.text();
    console.log('Login Body:', body);
  } catch (err) {
    console.error('Login error:', err);
  }
}

test();

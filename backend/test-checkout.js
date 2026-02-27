import fetch from "node-fetch";

async function test() {
  try {
    const res = await fetch("http://localhost:5001/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        planType: "pro",
        userId: "test_user_123",
        userEmail: "test@example.com"
      })
    });
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
  } catch(e) { console.error(e); }
}
test();

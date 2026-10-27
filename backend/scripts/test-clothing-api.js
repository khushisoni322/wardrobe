const readline = require("node:readline/promises");
const { stdin, stdout } = require("node:process");

const BASE_URL = "http://127.0.0.1:5000/api";

async function request(path, options = {}, token = null) {
  const headers = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const text = await response.text();

  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { message: text };
  }

  if (!response.ok) {
    throw new Error(
      `${options.method || "GET"} ${path} failed (${response.status}): ${
        data.message || text
      }`
    );
  }

  return data;
}

async function main() {
  const rl = readline.createInterface({ input: stdin, output: stdout });

  let token;
  let testClothingId;

  try {
    console.log("\n👗 WARDROBE CLOTHING API TEST\n");

    const email = (
      await rl.question("Registered account email: ")
    ).trim();

    const password = await rl.question("Registered account password: ");

    if (!email || !password) {
      throw new Error("Email and password are required.");
    }

    console.log("\n1. Logging in...");

    const login = await request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (!login.token) {
      throw new Error("Login response did not contain a token.");
    }

    token = login.token;
    console.log("✅ Login successful.");

    console.log("\n2. Fetching your families...");

    const familyResult = await request("/families", {}, token);
    const families =
      familyResult.families ||
      familyResult.data ||
      (Array.isArray(familyResult) ? familyResult : []);

    if (!families.length) {
      console.log("Family API response:", JSON.stringify(familyResult, null, 2));
      throw new Error(
        "No family found. Create a family in Wardrobe before running this test."
      );
    }

    console.log("\nYour families:");
    families.forEach((family, index) => {
      console.log(`${index + 1}. ${family.name} (${family.id})`);
    });

    const familyId = families[0].id;

    console.log(`\nUsing family: ${families[0].name}`);

    console.log("\n3. Creating a test clothing item...");

    const createdResult = await request(
      `/families/${encodeURIComponent(familyId)}/clothes`,
      {
        method: "POST",
        body: JSON.stringify({
          name: `Wardrobe API Test ${Date.now()}`,
          category: "Testing",
          color: "Blue",
          occasion: "Testing",
        }),
      },
      token
    );

    const clothing = createdResult.clothing;

    if (!clothing?.id) {
      console.log(JSON.stringify(createdResult, null, 2));
      throw new Error("Created clothing response did not contain an item ID.");
    }

    testClothingId = clothing.id;

    console.log("✅ Clothing item created:", clothing.id);

    console.log("\n4. Fetching family clothes...");

    const clothesResult = await request(
      `/families/${encodeURIComponent(familyId)}/clothes`,
      {},
      token
    );

    const clothes = clothesResult.clothes || [];

    if (!clothes.some((item) => item.id === testClothingId)) {
      throw new Error("The new item was not found in the family clothes list.");
    }

    console.log("✅ Test item found in database response.");

    console.log("\n5. Toggling favorite...");

    const favoriteResult = await request(
      `/clothes/${encodeURIComponent(testClothingId)}/favorite`,
      { method: "PATCH" },
      token
    );

    console.log(
      `✅ Favorite updated: ${favoriteResult.clothing?.favorite}`
    );

    console.log("\n6. Deleting test clothing item...");

    await request(
      `/clothes/${encodeURIComponent(testClothingId)}`,
      { method: "DELETE" },
      token
    );

    testClothingId = null;
    console.log("✅ Test item deleted.");

    console.log("\n🎉 ALL CLOTHING API TESTS PASSED!");
  } catch (error) {
    console.error("\n❌ TEST FAILED:", error.message);
  } finally {
    // Clean up the temporary test item if an earlier step failed.
    if (testClothingId && token) {
      try {
        await request(
          `/clothes/${encodeURIComponent(testClothingId)}`,
          { method: "DELETE" },
          token
        );
        console.log("\n🧹 Temporary test item cleaned up.");
      } catch {
        console.log(
          "\n⚠️ Could not clean up the test item. Check your database if needed."
        );
      }
    }

    rl.close();
  }
}

main();
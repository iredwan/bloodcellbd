import("./app.js")
  .then(({ default: app }) => {
    app(); // Assuming your app.js exports a function as default
  })
  .catch((error) => {
    console.error("Failed to load the app:", error);
  });

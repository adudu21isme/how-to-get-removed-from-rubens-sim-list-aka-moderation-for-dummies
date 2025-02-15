(async () => {
  const UserId = 684075566;
  let total = 0;
  let last = false;

  while (true) {
    try {
      await new Promise((r) => setTimeout(r, 100));
      const response = await $.ajax({
        url: `https://games.roblox.com/v2/users/${UserId}/favorite/games?limit=50&sortOrder=Desc`,
        method: "GET",
      });
      if (!response || !response.data || !response.data.length) {
        console.log(`✅ Finished! Unfavorited ${total} total games.`);
        break;
      }
      for (const game of response.data) {
        const universeId = game.id;
        if (!universeId) {
          console.log(`⚠️ UniverseId not found! ${game}`);
          continue;
        }
        try {
          await new Promise((resolve) => {
            $.ajax({
              method: "POST",
              url: `https://games.roblox.com/v1/games/${universeId}/favorites`,
              contentType: "application/json",
              data: JSON.stringify({ isFavorited: false }),
              success: () => {
                console.log(`⏳ Unfavorited: ${game.name}`);
                total++;
                setTimeout(resolve, 200);
              },
              error: (err) => {
                console.warn(`Failed unfavoriting ${game.name}: ${err}`);
                setTimeout(resolve, 200);
              },
            });
          });
        } catch (err) {
          console.warn(`Error unfavoriting ${game.name}: ${err}`);
        }
      }
      if (!response.nextPageCursor) {
        if (last == true) {
          console.log(`✅ Finished! Unfavorited ${total} total games.`);
          break;
        }
        console.log("⌛ Rechecking inventory (final check)");
        last = true;
      }
    } catch (err) {
      console.error(`❌ Failed processing: ${err}`);
      break;
    }
  }
})();

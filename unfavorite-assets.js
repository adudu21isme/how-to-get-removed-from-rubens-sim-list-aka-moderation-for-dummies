(async () => {
  const AssetType = 3;
  const UserId = 684075566;
  let total = 0;
  let last = false;

  while (true) {
    try {
      await new Promise((r) => setTimeout(r, 500));
      const response = await $.ajax({
        url: `https://www.roblox.com/users/favorites/list-json?assetTypeId=${AssetType}&itemsPerPage=100&userId=${UserId}`,
        method: "GET",
      });
      if (!response || !response.Data || !response.Data.Items.length) {
        console.log(
          `✅ Stopped unexpectly! Unfavorited ${total} total audios.`
        );
        break;
      }
      for (const audio of response.Data.Items) {
        const AssetId = audio.Item.AssetId;
        if (!AssetId) {
          console.log(`⚠️ AssetId not found! ${audio}`);
          continue;
        }
        try {
          await new Promise((resolve) => {
            $.ajax({
              method: "DELETE",
              url: `https://catalog.roblox.com/v1/favorites/users/${UserId}/assets/${AssetId}/favorite`,
              contentType: "application/json",
              success: () => {
                console.log(`⏳ Unfavorited: ${audio.Item.Name}`);
                total++;
                setTimeout(resolve, 100);
              },
              error: (err) => {
                console.error(
                  `⚠️ Failed unfavoriting ${audio.Item.Name}: ${err}`
                );
                setTimeout(resolve, 100);
              },
            });
          });
        } catch (err) {
          console.error(`⚠️ Error unfavoriting ${audio.name}: ${err}`);
        }
      }
      if (!response.nextPageCursor) {
        if (last == true) {
          console.log(`✅ Unfavorited ${total} total audios.`);
          break;
        }
        console.log("⌛ Rechecking inventory (final check)");
        last = true;
      }
    } catch (err) {
      console.error(`❌: Failed processing: ${err}`);
      break;
    }
  }
})();

(async () => {
  const AssetType = 10;
  const UserId = 684075566;
  let total = 0;
  const fail = new Set();
  let last = false;

  while (true) {
    try {
      await new Promise((r) => setTimeout(r, 500));
      const response = await $.ajax({
        url: `https://inventory.roblox.com/v2/users/${UserId}/inventory/${AssetType}?limit=100&sortOrder=Desc`,
        method: "GET",
      });
      if (!response || !response.data || !response.data.length) {
        console.log(
          `✅ Stopped unexpectly! Deleted ${total} total assets. Assets created by roblox cannot be deleted.`
        );
        break;
      }
      for (const asset of response.data) {
        const AssetId = asset.assetId;
        if (fail.has(AssetId)) {
          continue;
        }
        try {
          await new Promise((resolve) => {
            $.ajax({
              method: "DELETE",
              url: `https://inventory.roblox.com/v2/inventory/asset/${AssetId}`,
              contentType: "application/json",
              success: () => {
                console.log(`⏳ Deleted ${asset.assetName}`);
                total++;
                setTimeout(resolve, 100);
              },
              error: (err) => {
                fail.add(AssetId);
                console.warn(`Failed deleting: ${asset.assetName}. ${err}`);
                setTimeout(resolve, 100);
              },
            });
          });
        } catch (err) {
          console.warn(`Error deleting ${asset.assetName}. ${err}`);
        }
      }
      if (!response.nextPageCursor) {
        if (last == true) {
          console.log(
            `✅ Deleted ${total} total assets. Assets created by roblox cannot be deleted.`
          );
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

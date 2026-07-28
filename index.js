require("dotenv").config();

const { Client } = require("@notionhq/client");

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

async function test() {
  // Done = true のページを取得
  const response = await notion.dataSources.query({
    data_source_id: process.env.DATABASE_ID,
    filter: {
      property: "Done",
      checkbox: {
        equals: true,
      },
    },
  });

  console.log(`Checked: ${response.results.length}件`);

  // 1件ずつチェックを外す
  for (const page of response.results) {
    const taskName =
      page.properties["Task name"].title?.[0]?.plain_text ?? "(Untitled)";

    await notion.pages.update({
      page_id: page.id,
      properties: {
        Done: {
          checkbox: false,
        },
      },
    });

    console.log(`✓ Unchecked: ${taskName}`);
  }

  console.log("Completed");
}

test().catch(console.error);

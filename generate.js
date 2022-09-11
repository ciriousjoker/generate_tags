const puppeteer = require("puppeteer");
const handlebars = require("handlebars");

const colorLight = "rgba(255, 255, 255, 0.87)";
const colorDark = "rgba(0, 0, 0, 0.87)";

const tags = [
  {
    name: "tag 1",
    bgcolor: "#f44336",
    color: colorLight,
  },
  {
    name: "tag 2",
    bgcolor: "#ff9800",
    color: colorDark,
  },
];

const template = `<html>
<body>
<div>
<div class="viewport">
<span>
        {{name}}
    </span>
</div>
    
</div>

<style>
    div {
        display: flex;
    }

    .viewport {
        margin: auto;
    }

    span {
        margin: 16px;
        white-space: nowrap;
        background: {{bgcolor}};
        color: {{color}};
        padding: 40px 80px;
        border-radius: 40px;
        font-family: "Roboto";
        font-size: 140px;
    }
</style>
</body>
</html>
`;

(async () => {
  let i = 0;
  for (const tag of tags) {
    const filename = `./export/${++i}_${tag.name}.png`;
    await convertToPng({
      html: template,
      filename,
      content: {
        name: tag.name,
        bgcolor: tag.bgcolor,
        color: tag.color,
      },
    });
    console.log("Exported: " + filename);
  }
})();

async function convertToPng({ html, filename, content }) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  if (content) {
    const template = handlebars.compile(html);
    html = template(content, { waitUntil: "load" });
  }
  await page.setContent(html);
  const element = await page.$(".viewport");
  await element.screenshot({
    path: filename,
    type: "png",
    omitBackground: true,
  });
  await browser.close();
}

import { mkdirSync, writeFileSync, cpSync } from "node:fs";
import path from "node:path";
import {
  aboutPage,
  academyPage,
  articlePage,
  articleSlugs,
  articlesPage,
  categoryIds,
  contactPage,
  copilotPage,
  dashboardPage,
  homePage,
  learnCategoryPage,
  learnLessonPage,
  lessonPairs,
  loginPage,
  profilePage,
  progressPage,
  servicesPage,
  subscriptionPage,
  supportPage,
} from "./pages";

const base = "/sales-pro";
const out = path.join(process.cwd(), "pages-out");

const files: Array<[string, string]> = [
  ["index.html", homePage(base)],
  ["academy/index.html", academyPage(base)],
  ["dashboard/copilot/index.html", copilotPage(base)],
  ["articles/index.html", articlesPage(base)],
  ["services/index.html", servicesPage(base)],
  ["support/index.html", supportPage(base)],
  ["about/index.html", aboutPage(base)],
  ["contact/index.html", contactPage(base)],
  ["subscription/index.html", subscriptionPage(base)],
  ["dashboard/index.html", dashboardPage(base)],
  ["login/index.html", loginPage(base)],
  ["register/index.html", loginPage(base)],
  ["progress/index.html", progressPage(base)],
  ["profile/index.html", profilePage(base)],
  ["me/index.html", profilePage(base)],
  ["wallet/index.html", dashboardPage(base)],
];

for (const slug of articleSlugs()) {
  const html = articlePage(base, slug);
  if (html) files.push([`articles/${slug}/index.html`, html]);
}
for (const id of categoryIds()) {
  const html = learnCategoryPage(base, id);
  if (html) {
    files.push([`learn/${id}/index.html`, html]);
    files.push([`courses/${id}/index.html`, html]);
  }
}
for (const pair of lessonPairs()) {
  const html = learnLessonPage(base, pair.category, pair.lesson);
  if (html) files.push([`learn/${pair.category}/${pair.lesson}/index.html`, html]);
}

for (const [file, html] of files) {
  const target = path.join(out, file);
  mkdirSync(path.dirname(target), { recursive: true });
  writeFileSync(target, html);
}
cpSync(path.join(process.cwd(), "public", "client.js"), path.join(out, "client.js"));
cpSync(path.join(process.cwd(), "public", "lenis.min.js"), path.join(out, "lenis.min.js"));
cpSync(path.join(process.cwd(), "public", "lenis.css"), path.join(out, "lenis.css"));
writeFileSync(path.join(out, ".nojekyll"), "");
console.log(`Wrote ${files.length} pages to ${out}`);

import path from "node:path";
import express from "express";
import {
  aboutPage,
  academyPage,
  articlePage,
  articlesPage,
  contactPage,
  copilotPage,
  dashboardPage,
  demoPage,
  homePage,
  learnCategoryPage,
  learnLessonPage,
  loginPage,
  registerPage,
  notFoundPage,
  profilePage,
  progressPage,
  servicesPage,
  subscriptionPage,
  supportPage,
  answerCounter,
} from "./pages";

const base = process.env.BASE_PATH || "";
const port = Number(process.env.PORT || 43131);
const host = process.env.HOST || "0.0.0.0";

export function createApp() {
  const app = express();
  app.disable("x-powered-by");
  app.use(express.json());
  app.use(base || "/", express.static(path.join(process.cwd(), "public")));

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, runtime: "node" });
  });
  app.post("/api/copilot/counter", (req, res) => {
    const text = typeof req.body?.text === "string" ? req.body.text : "";
    const variant = Number(req.body?.variant) || 0;
    res.json(answerCounter(text, variant));
  });

  const send = (html: string | null, res: express.Response) => {
    if (!html) {
      res.status(404).type("html").send(notFoundPage(base));
      return;
    }
    res.type("html").send(html);
  };

  app.get(["/", "/index.html"], (_req, res) => send(homePage(base), res));
  app.get(["/academy", "/academy/"], (_req, res) => send(academyPage(base), res));
  app.get(["/demo", "/demo/"], (_req, res) => send(demoPage(base), res));
  app.get(["/minutes", "/minutes/"], (_req, res) => res.redirect(302, `${base}/services/#ai-minutes`));
  app.get(["/dashboard/copilot", "/dashboard/copilot/"], (_req, res) => send(copilotPage(base), res));
  app.get(["/articles", "/articles/"], (_req, res) => send(articlesPage(base), res));
  const one = (value: string | string[]) => (Array.isArray(value) ? value[0] : value);
  app.get(["/articles/:slug", "/articles/:slug/"], (req, res) => send(articlePage(base, one(req.params.slug)), res));
  app.get(["/services", "/services/"], (_req, res) => send(servicesPage(base), res));
  app.get(["/support", "/support/"], (_req, res) => send(supportPage(base), res));
  app.get(["/about", "/about/"], (_req, res) => send(aboutPage(base), res));
  app.get(["/contact", "/contact/"], (_req, res) => send(contactPage(base), res));
  app.get(["/subscription", "/subscription/"], (_req, res) => send(subscriptionPage(base), res));
  app.get(["/dashboard", "/dashboard/"], (_req, res) => send(dashboardPage(base), res));
  app.get(["/wallet", "/wallet/"], (_req, res) => res.redirect(302, `${base}/dashboard/?tab=wallet`));
  app.get(["/login", "/login/"], (_req, res) => send(loginPage(base), res));
  app.get(["/register", "/register/"], (_req, res) => send(registerPage(base), res));
  app.get(["/progress", "/progress/"], (_req, res) => send(progressPage(base), res));
  app.get(["/profile", "/profile/", "/me", "/me/"], (_req, res) => send(profilePage(base), res));
  app.get(["/learn/:category", "/learn/:category/", "/courses/:category", "/courses/:category/"], (req, res) => send(learnCategoryPage(base, one(req.params.category)), res));
  app.get(["/learn/:category/:lesson", "/learn/:category/:lesson/"], (req, res) => send(learnLessonPage(base, one(req.params.category), one(req.params.lesson)), res));
  app.use((_req, res) => send(null, res));
  return app;
}

if (process.argv[1] && process.argv[1].includes("site")) {
  createApp().listen(port, host, () => {
    console.log(`NexSell Node server http://${host}:${port}`);
  });
}

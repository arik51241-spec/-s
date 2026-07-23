import { headers } from "next/headers";
import { isAdmin } from "@/lib/admin-auth";
import { getSiteState } from "@/lib/site-state";
import AdminPanel from "./AdminPanel";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const requestHeaders = await headers();

  if (!isAdmin(requestHeaders)) {
    return <main className="adminDenied"><div><span>403</span><h1>Эта страница закрыта</h1><p>Панель управления доступна только с IP владельца.</p><a href="/">Вернуться на сайт</a></div></main>;
  }

  return <AdminPanel initialState={await getSiteState()} />;
}

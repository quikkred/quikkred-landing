import { redirect } from "next/navigation";

// 301 Redirect: /about → /about-us
export default function AboutRedirect() {
  redirect("/about-us");
}

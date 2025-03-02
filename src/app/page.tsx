import UserButton from "@/components/UserButton";
import { auth } from "@/lib/auth";
import { dmsans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { getUser } from "./actions";
import HeroComponent from "./HeroComponent";

export default async function Home() {
  const session = await getUser();
  return <HeroComponent />;
}

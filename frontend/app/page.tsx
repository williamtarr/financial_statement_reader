import Image from "next/image";
import Page from "@/app/dashboard/page";
import { redirect } from "next/navigation";

export default function Home() {
  return (
    redirect('/dashboard')
  );
}
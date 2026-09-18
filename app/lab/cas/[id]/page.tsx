import { redirect } from "next/navigation";

export default async function CaseIndex({ params }: PageProps<"/lab/cas/[id]">) {
  const { id } = await params;
  redirect(`/lab/cas/${id}/brief`);
}

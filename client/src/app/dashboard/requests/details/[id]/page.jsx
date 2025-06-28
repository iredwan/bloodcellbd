import RequestDetailsPageClient from "@/components/dashboard-components/Request/RequestDetails";


export default async function Page(props) {
  const { id } = await props.params;

  return <RequestDetailsPageClient requestParamsId={id} />;
}

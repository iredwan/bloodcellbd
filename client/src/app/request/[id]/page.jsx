import RequestDetailsPagePublic from "@/components/RequestDetailsPagePublic";

export async function generateMetadata(props) {
  const params = await props?.params; 

  const id = params?.id;
  if (!id) {
    return {
      title: "Invalid Request",
      description: "No request ID provided",
    };
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/requests/${id}`, {
      cache: "no-store",
    });
    const data = await res.json();
    const request = data?.data;
    const requestUser = data?.data.userId;

    const ogUrl = `${process.env.NEXT_PUBLIC_API_URL}/og/request?name=${encodeURIComponent(requestUser.name)}&bloodGroup=${encodeURIComponent(request.bloodGroup)}&district=${encodeURIComponent(request.district)}&upazila=${encodeURIComponent(request.upazila)}&hospitalName=${encodeURIComponent(request.hospitalName)}&profileImage=${encodeURIComponent(requestUser.profileImage)}`;

    return {
      title: `Need ${data?.data?.bloodGroup} Blood`,
      description: `Urgent request at ${data?.data?.hospitalName}, ${data?.data?.district}`,
      openGraph: {
        images: [
          {
            url: ogUrl,
            width: 1200,
            height: 630,
          },
        ],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error.message);
    return {
      title: "Blood Request",
      description: "Error loading blood request metadata",
    };
  }
}

export default async function Page(props) {
  const { id } = await props.params;

  return <RequestDetailsPagePublic requestMongoDBId={id} />;
}

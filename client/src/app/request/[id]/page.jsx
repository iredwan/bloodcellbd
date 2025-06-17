import BloodDonationPost from "@/components/BloodDonationPost";

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

    return {
      title: `Need ${data?.data?.bloodGroup} Blood`,
      description: `Urgent request at ${data?.data?.hospitalName}, ${data?.data?.district}`,
      openGraph: {
        images: [
          {
            url: `https://yourdomain.com/api/og-request?group=${data?.data?.bloodGroup}&location=${data?.data?.district}`,
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

  return <BloodDonationPost requestMongoDBId={id} />;
}

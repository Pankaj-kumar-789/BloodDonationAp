import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CertificateView from "@/components/CertificateView";

export default async function CertificatePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  // Try to find the donation history record
  const donation = await prisma.donationHistory.findUnique({
    where: { id },
    include: {
      donor: {
        include: {
          user: true
        }
      }
    }
  });

  if (!donation) {
    // If it's not a DonationHistory ID, try seeing if it's a BloodRequest ID
    // Some platforms use BloodRequest instead of explicitly saving history
    const request = await prisma.bloodRequest.findUnique({
      where: { id },
      include: {
        acceptedBy: {
          include: {
            donorProfile: true
          }
        }
      }
    });

    if (!request || request.status !== "COMPLETED" || !request.acceptedBy) {
      notFound();
    }

    return (
      <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-[#0a192f]/10 py-4 px-4 flex flex-col justify-center">
        <CertificateView
          id={request.id}
          donorName={request.acceptedBy.name}
          hospitalName={request.hospital || request.city}
          date={request.updatedAt.toISOString()}
          bloodGroup={request.bloodGroup}
          units={request.units}
        />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-[#0a192f]/10 py-4 px-4 flex flex-col justify-center">
      <CertificateView
        id={donation.id}
        donorName={donation.donor.user.name}
        hospitalName={donation.hospital}
        date={donation.date.toISOString()}
        bloodGroup={donation.donor.bloodGroup}
        units={donation.units}
      />
    </div>
  );
}

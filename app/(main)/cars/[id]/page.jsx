// app/(main)/cars/[id]/page.jsx

import { getCarById } from "@/actions/car-listing";
import { CarDetails } from "./_components/car-details";
import { notFound } from "next/navigation";

// ✅ Correctly awaiting params
export async function generateMetadata({ params }) {
  const awaitedParams = await params;
  const id = awaitedParams.id;

  if (!id) {
    return {
      title: "Car Not Found | Cars",
      description: "Invalid car ID provided.",
    };
  }

  const result = await getCarById(id);

  if (!result.success) {
    return {
      title: "Car Not Found | Cars",
      description: "The requested car could not be found",
    };
  }

  const car = result.data;

  return {
    title: `${car.year} ${car.make} ${car.model} | Cars`,
    description: car.description?.substring(0, 160) ?? "Car details",
    openGraph: {
      images: car.images?.[0] ? [car.images[0]] : [],
    },
  };
}

// ✅ Await params properly
export default async function CarDetailsPage({ params }) {
  const awaitedParams = await params;  // Ensure params are awaited

  const id = awaitedParams.id;

  if (!id) {
    notFound();  // Handle case where id is not found
  }

  const result = await getCarById(id);

  if (!result.success) {
    notFound();  // Handle case where car details are not found
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <CarDetails car={result.data} testDriveInfo={result.data.testDriveInfo} />
    </div>
  );
}

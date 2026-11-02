"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const amenities = [
  "Lighting Equipment",
  "Sound System",
  "Air Conditioning",
  "Wi-Fi",
  "Parking",
  "Changing Room",
  "Restroom",
  "Makeup Station",
];

export default function AddStudioForm() {
  const router = useRouter();

  const { data: session } = authClient.useSession();
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const [isUploading, setIsUploading] = useState(false);

  async function uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch("/api/upload-image", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Image upload failed");
    }

    return result.imageUrl;
  }

  function handleAmenityChange(amenity: string, checked: boolean) {
    setSelectedAmenities((previous) =>
      checked
        ? [...previous, amenity]
        : previous.filter((item) => item !== amenity),
    );
  }
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const mainFile = formData.get("image");

    if (!(mainFile instanceof File) || mainFile.size === 0) {
      toast.error("Please select a studio image");
      return;
    }

    setIsUploading(true);

    try {
      // Upload main image to ImgBB
      const imageUrl = await uploadImage(mainFile);

      // Keep additional gallery URLs
      const galleryFiles = formData
        .getAll("imageGallery")
        .filter((file): file is File => file instanceof File && file.size > 0);

      const galleryUrls = await Promise.all(
        galleryFiles.map((file) => uploadImage(file)),
      );

      const studioData = {
        title: formData.get("title"),
        category: formData.get("category"),
        hourlyRate: formData.get("hourlyRate"),
        dailyRate: formData.get("dailyRate"),
        monthlyRate: formData.get("monthlyRate"),
        yearlyRate: formData.get("yearlyRate"),
        securityDeposit: formData.get("securityDeposit"),
        capacity: formData.get("capacity"),
        location: formData.get("location"),
        address: formData.get("address"),
        image: imageUrl,
        imageGallery: [imageUrl, ...galleryUrls],
        amenities: selectedAmenities,
        overview: formData.get("overview"),
      };

      const cookieResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/set-jwt-cookie`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      if (!cookieResponse.ok) {
        toast.error("Authentication failed. Please login again.");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/studios`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(studioData),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || "Failed to add studio");
        return;
      }

      toast.success("Studio added successfully!");
      router.push("/my-listings");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setIsUploading(false);
    }
  }
  return (
    <main className="container mx-auto min-h-screen px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-primary">Add New Studio</h1>
        <p className="mt-2 text-muted-foreground">
          Share your creative space with creators.
        </p>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Studio Information</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="hostName">Host Name</label>
                  <Input
                    id="hostName"
                    value={session?.user?.name || ""}
                    readOnly
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="hostEmail">Host Email</label>
                  <Input
                    id="hostEmail"
                    value={session?.user?.email || ""}
                    readOnly
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="title">Studio Title</label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter studio name"
                  required
                />
              </div>

              <div className="space-y-2">
                <label>Category</label>
                <Select name="category" required>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Photo Studios">Photo Studios</SelectItem>
                    <SelectItem value="Sound Stages">Sound Stages</SelectItem>
                    <SelectItem value="Podcast Rooms">Podcast Rooms</SelectItem>
                    <SelectItem value="Music Suites">Music Suites</SelectItem>
                    <SelectItem value="Art Workshops">Art Workshops</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="hourlyRate">Hourly Rate ($)</label>
                  <Input
                    id="hourlyRate"
                    name="hourlyRate"
                    type="number"
                    min="1"
                    placeholder="50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="securityDeposit">Security Deposit ($)</label>
                  <Input
                    id="securityDeposit"
                    name="securityDeposit"
                    type="number"
                    min="0"
                    placeholder="100"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="capacity">Maximum Capacity</label>
                  <Input
                    id="capacity"
                    name="capacity"
                    type="number"
                    min="1"
                    placeholder="10"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="location">Location</label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="City or area"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="dailyRate">Daily Rate ($)</label>
                <Input
                  id="dailyRate"
                  name="dailyRate"
                  type="number"
                  min="1"
                  required
                  placeholder="200"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="monthlyRate">Monthly Rate ($)</label>
                <Input
                  id="monthlyRate"
                  name="monthlyRate"
                  type="number"
                  min="1"
                  required
                  placeholder="2000"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="yearlyRate">Yearly Rate ($)</label>
                <Input
                  id="yearlyRate"
                  name="yearlyRate"
                  type="number"
                  min="1"
                  required
                  placeholder="20000"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="address">Full Address</label>
                <Input
                  id="address"
                  name="address"
                  placeholder="Enter full studio address"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="image">Studio Image</label>
                <Input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="imageGallery">Additional Gallery Images</label>
                <Input
                  id="imageGallery"
                  name="imageGallery"
                  type="file"
                  accept="image/*"
                  multiple
                />
              </div>

              <div className="space-y-3">
                <label className="font-medium">Amenities</label>
                <div className="grid gap-4 sm:grid-cols-2">
                  {amenities.map((amenity) => (
                    <label key={amenity} className="flex items-center gap-3">
                      <Checkbox
                        checked={selectedAmenities.includes(amenity)}
                        onCheckedChange={(checked) =>
                          handleAmenityChange(amenity, checked === true)
                        }
                      />
                      <span className="text-sm">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="overview">Studio Overview</label>
                <Textarea
                  id="overview"
                  name="overview"
                  placeholder="Describe your studio and its features..."
                  rows={5}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isUploading}>
                {isUploading ? "Uploading Image..." : "Add Studio"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

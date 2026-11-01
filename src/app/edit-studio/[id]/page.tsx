"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Studio = {
  title: string;
  category: string;
  hourlyRate: number;
  dailyRate: number;
  monthlyRate: number;
  yearlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  location: string;
  address: string;
  image: string;
  amenities: string[];
  overview: string;
  hostName: string;
  hostEmail: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function EditStudioContent() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: session } = authClient.useSession();

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [formData, setFormData] = useState<Studio>({
    title: "",
    category: "",
    hourlyRate: 0,
    dailyRate: 0,
    monthlyRate: 0,
    yearlyRate: 0,
    securityDeposit: 0,
    maxCapacity: 1,
    location: "",
    address: "",
    image: "",
    amenities: [],
    overview: "",
    hostName: "",
    hostEmail: "",
  });

  useEffect(() => {
    async function fetchStudio() {
      try {
        const response = await fetch(`${API_URL}/api/studios/${id}`, {
          credentials: "include",
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Studio not found");
        }

        const studio = result.data;

        setFormData({
          title: studio.title || "",
          category: studio.category || "",
          hourlyRate: studio.hourlyRate || 0,
          dailyRate: studio.dailyRate || 0,
          monthlyRate: studio.monthlyRate || 0,
          yearlyRate: studio.yearlyRate || 0,
          securityDeposit: studio.securityDeposit || 0,
          maxCapacity: studio.maxCapacity || 1,
          location: studio.location || "",
          address: studio.address || "",
          image: studio.image || "",
          amenities: studio.amenities || [],
          overview: studio.overview || "",
          hostName: studio.hostName || "",
          hostEmail: studio.hostEmail || "",
        });
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to load studio",
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchStudio();
  }, [id]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "hourlyRate" ||
        name === "dailyRate" ||
        name === "monthlyRate" ||
        name === "yearlyRate" ||
        name === "securityDeposit" ||
        name === "maxCapacity"
          ? Number(value)
          : value,
    }));
  }

  async function handleUpdate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setUpdating(true);

    try {
      const response = await fetch(`${API_URL}/api/studios/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update studio");
      }

      toast.success("Studio updated successfully!");
      router.push("/my-listings");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return <p className="py-20 text-center">Loading studio...</p>;
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Edit Studio</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleUpdate} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Studio Title
              </label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Category</label>
              <Input
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Hourly Rate
                </label>
                <Input
                  type="number"
                  name="hourlyRate"
                  value={formData.hourlyRate}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Daily Rate
                </label>
                <Input
                  type="number"
                  name="dailyRate"
                  value={formData.dailyRate}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Monthly Rate
                </label>
                <Input
                  type="number"
                  name="monthlyRate"
                  value={formData.monthlyRate}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Yearly Rate
                </label>
                <Input
                  type="number"
                  name="yearlyRate"
                  value={formData.yearlyRate}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Security Deposit
                </label>
                <Input
                  type="number"
                  name="securityDeposit"
                  value={formData.securityDeposit}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Maximum Capacity
              </label>
              <Input
                type="number"
                name="maxCapacity"
                value={formData.maxCapacity}
                onChange={handleChange}
                min="1"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Location</label>
              <Input
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Address</label>
              <Input
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Image URL
              </label>
              <Input
                name="image"
                type="url"
                value={formData.image}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Amenities (comma separated)
              </label>
              <Input
                value={formData.amenities.join(", ")}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    amenities: e.target.value
                      .split(",")
                      .map((item) => item.trim())
                      .filter(Boolean),
                  }))
                }
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Studio Overview
              </label>
              <Textarea
                name="overview"
                value={formData.overview}
                onChange={handleChange}
                rows={5}
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Host Name
              </label>
              <Input value={formData.hostName} readOnly />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Host Email
              </label>
              <Input value={formData.hostEmail} readOnly />
            </div>

            <Button type="submit" className="w-full" disabled={updating}>
              {updating ? "Updating..." : "Update Studio"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
export default function EditStudioPage() {
  return (
    <ProtectedRoute>
      <EditStudioContent />
    </ProtectedRoute>
  );
}

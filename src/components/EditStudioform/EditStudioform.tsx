"use client";

import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

type Props = {
  studioId: string | null;
  onClose: () => void;
  onUpdated: () => void;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const initialFormData: Studio = {
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
};

export default function EditStudioform({
  studioId,
  onClose,
  onUpdated,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState<Studio>(initialFormData);

  useEffect(() => {
    if (!studioId) return;

    async function fetchStudio() {
      setLoading(true);

      try {
        const response = await fetch(`${API_URL}/api/my-studios/${studioId}`, {
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
          maxCapacity: studio.capacity ?? studio.maxCapacity ?? 1,
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

    fetchStudio();
  }, [studioId]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: [
        "hourlyRate",
        "dailyRate",
        "monthlyRate",
        "yearlyRate",
        "securityDeposit",
        "maxCapacity",
      ].includes(name)
        ? Number(value)
        : value,
    }));
  }

  async function uploadImage(file: File): Promise<string> {
    const imageFormData = new FormData();
    imageFormData.append("image", file);

    const response = await fetch("/api/upload-image", {
      method: "POST",
      body: imageFormData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Image upload failed");
    }

    return result.imageUrl;
  }

  async function handleUpdate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!studioId) return;

    const form = new FormData(e.currentTarget);
    const imageFile = form.get("image");

    setUpdating(true);

    try {
      let imageUrl = formData.image;

      if (imageFile instanceof File && imageFile.size > 0) {
        setIsUploading(true);
        imageUrl = await uploadImage(imageFile);
      }

      // Create a fresh JWT cookie
      const cookieResponse = await fetch(`${API_URL}/api/auth/set-jwt-cookie`, {
        method: "POST",
        credentials: "include",
      });

      if (!cookieResponse.ok) {
        throw new Error("Authentication failed. Please login again.");
      }

      const updatedData = {
        ...formData,
        capacity: formData.maxCapacity,
        image: imageUrl,
      };

      delete (updatedData as Partial<Studio>).maxCapacity;

      const response = await fetch(`${API_URL}/api/my-studios/${studioId}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update studio");
      }

      toast.success("Studio updated successfully!");
      onUpdated();
      onClose();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setUpdating(false);
      setIsUploading(false);
    }
  }

  return (
    <Dialog
      open={!!studioId}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Edit Studio</DialogTitle>
        </DialogHeader>

        {loading ? (
          <p className="py-12 text-center">Loading studio...</p>
        ) : (
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
              {(
                [
                  ["hourlyRate", "Hourly Rate"],
                  ["dailyRate", "Daily Rate"],
                  ["monthlyRate", "Monthly Rate"],
                  ["yearlyRate", "Yearly Rate"],
                  ["securityDeposit", "Security Deposit"],
                ] as const
              ).map(([name, label]) => (
                <div key={name}>
                  <label className="mb-2 block text-sm font-medium">
                    {label}
                  </label>
                  <Input
                    type="number"
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    min={name === "securityDeposit" ? "0" : "1"}
                    required
                  />
                </div>
              ))}
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
                Choose Studio Image
              </label>

              {formData.image && (
                <Image
                  src={formData.image}
                  alt="Current studio"
                  width={128}
                  height={128}
                  unoptimized
                  className="mb-3 h-32 w-32 rounded-md object-cover"
                />
              )}

              <Input name="image" type="file" accept="image/*" />

              <p className="mt-1 text-xs text-muted-foreground">
                Select a new image only if you want to replace the current one.
              </p>
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
              {updating
                ? isUploading
                  ? "Uploading Image..."
                  : "Updating..."
                : "Update Studio"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

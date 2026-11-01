import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const image = formData.get("image");

    if (!(image instanceof File)) {
      return NextResponse.json(
        { message: "Image is required" },
        { status: 400 },
      );
    }

    if (!image.type.startsWith("image/")) {
      return NextResponse.json(
        { message: "Only image files are allowed" },
        { status: 400 },
      );
    }

    const apiKey = process.env.IMGBB_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { message: "ImgBB API key is missing" },
        { status: 500 },
      );
    }

    const uploadData = new FormData();
    uploadData.append("image", image);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      {
        method: "POST",
        body: uploadData,
      },
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      return NextResponse.json(
        { message: "Image upload failed" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      imageUrl: result.data.display_url,
    });
  } catch {
    return NextResponse.json(
      { message: "Something went wrong during upload" },
      { status: 500 },
    );
  }
}

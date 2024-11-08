"use client";

import Image from "next/image";
import { useRef, useState } from "react";

export default function Home() {
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    return (
        <div className="h-screen bg-gray-200 text-3xl font-bold text-center pt-10 flex flex-col">
            <h1>Create a gallery</h1>
            <div className="flex flex-wrap gap-2 p-5 bg-white w-[650px] min-h-[300px] mx-auto mt-6 mb-10 rounded-md shadow-sm">
                {imageUrls.map((url) => (
                    <div key={url} className="relative flex-1 basis-[300px] h-[200px]">
                        <Image
                            loader={({ src }) => {
                                // return ´${src}&img-format=webp&img-width=${width}´
                                return src;
                            }}
                            src={url}
                            alt="uploaded image"
                            className="shadow-sm object-cover border border-yellow-200"
                            fill
                        />
                    </div>
                ))}
            </div>
            <div className="flex justify-center">
                <input
                    ref={fileInputRef}
                    disabled={isUploading}
                    onChange={async (e) => {
                        const file = e.target.files?.[0] as File;

                        setIsUploading(true);
                        console.log(file);

                        const data = new FormData();
                        data.set("file", file);

                        const response = await fetch("/api/files", {
                            method: "POST",
                            body: data,
                        });
                        const signedUrl = await response.json();
                        setImageUrls((prev) => [...prev, signedUrl]);
                        setIsUploading(false);
                    }}
                    type="file"
                    className="absolute right-[9999px]"
                />
                <button
                    onClick={() => {
                        fileInputRef.current?.click();
                    }}
                    disabled={isUploading}
                    className="bg-blue-500 text-xl text-white p-4 px-8 rounded-full"
                >
                    {isUploading ? "Uploading..." : "Upload Image"}
                </button>
            </div>
        </div>
    );
}

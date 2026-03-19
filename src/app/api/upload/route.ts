/**
 * API d’upload d’images.
 *
 * Route : POST /api/upload (multipart/form-data, champ "files")
 * Rôle : vérifier type + taille, envoyer les fichiers vers Cloudinary, et retourner
 * les URLs sécurisées. Utilisé par l’administration (produits, galerie, hero, etc.).
 */
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files.length) {
      return NextResponse.json(
        { success: false, message: "Aucun fichier envoyé" },
        { status: 400 },
      );
    }

    const urls: string[] = [];

    for (const file of files) {
      // Sécurité : refuser ce qui n’est pas une image attendue.
      if (!ALLOWED_TYPES.has(file.type)) {
        return NextResponse.json(
          {
            success: false,
            message: `Type non autorisé : ${file.type}. Formats acceptés : JPEG, PNG, WebP`,
          },
          { status: 400 },
        );
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          {
            success: false,
            message: `Fichier trop volumineux (max 5 Mo) : ${file.name}`,
          },
          { status: 400 },
        );
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Upload via stream : évite de gérer des fichiers temporaires côté serveur.
      const result = await new Promise<{ secure_url: string }>(
        (resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              { folder: "ruhenna/products", resource_type: "image" },
              (error, result) => {
                if (error || !result) reject(error ?? new Error("Upload failed"));
                else resolve(result);
              },
            )
            .end(buffer);
        },
      );

      urls.push(result.secure_url);
    }

    return NextResponse.json({ success: true, urls });
  } catch (error) {
    console.error("Upload API error:", error);
    return NextResponse.json(
      { success: false, message: "Erreur lors de l'upload" },
      { status: 500 },
    );
  }
}

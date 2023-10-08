import { NextResponse } from "@/node_modules/next/server";
import { request } from "http";
import { currentUser } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";
import { checkSubscription } from "@/lib/subscription";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const user = await currentUser();
    const { src, name, description, categoryId, instructions, seed } = body;
    console.log(user);
    if (!user || !user.id || !user.firstName) {
      return new NextResponse("Unauthorized.", { status: 401 });
    }

    if (
      !src ||
      !name ||
      !description ||
      !categoryId ||
      !instructions ||
      !seed
    ) {
      return new NextResponse("Missing required fileds.", { status: 400 });
    }

    const isPro = await checkSubscription();
    if (!isPro) {
      return new NextResponse("Require pro subscription.", { status: 403 });
    }

    const companion = await prismadb.companion.create({
      data: {
        src,
        name,
        description,
        instructions,
        seed,
        userId: user.id,
        userName: user.firstName,
        categoryId,
      },
    });

    return NextResponse.json(companion);
  } catch (error) {
    console.log("COMPANION CREATION", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

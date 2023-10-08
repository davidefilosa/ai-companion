import { NextResponse } from "@/node_modules/next/server";
import { currentUser } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export async function PATCH(
  req: Request,
  { params }: { params: { companionId: string } }
) {
  try {
    const body = await req.json();
    const user = await currentUser();
    const { src, name, description, categoryId, instructions, seed } = body;

    if (!params.companionId) {
      return new NextResponse("Companion ID required", { status: 400 });
    }

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

    const companion = await prismadb.companion.update({
      where: { id: params.companionId, userId: user.id },
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

export async function DELETE(
  req: Request,
  { params }: { params: { companionId: string } }
) {
  try {
    const user = await currentUser();

    if (!params.companionId) {
      return new NextResponse("Companion ID required", { status: 400 });
    }

    if (!user || !user.id || !user.firstName) {
      return new NextResponse("Unauthorized.", { status: 401 });
    }

    const companion = await prismadb.companion.delete({
      where: { id: params.companionId, userId: user.id },
    });

    return NextResponse.json(companion);
  } catch (error) {
    console.log("COMPANION CREATION", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
